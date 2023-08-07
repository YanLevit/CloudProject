import { db } from '../db.js';
import jwt from 'jsonwebtoken';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';


dotenv.config();


const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'eu-central-1',
});

export const getPosts = (req, res) => {
    const q = req.query.cat
        ? 'SELECT * FROM posts WHERE cat=?'
        : 'SELECT * FROM posts';

    db.query(q, [req.query.cat], async (err, data) => {
        if (err) return res.status(500).send(err);
        const posts = await Promise.allSettled(
            data.map(async (post) => {
                const s3res = await s3Client.send(
                    new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: post.img,
                    })
                );
                const url = await s3res.Body.transformToString();
                return { ...post, img: url, fileName: post.img };
            })
        );
        return res.status(200).json(posts.map((p) => p.value));
    });
};

export const getPost = (req, res) => {
    const q =
        'SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ';

    db.query(q, [req.params.id], async (err, data) => {
        if (err) return res.status(500).json(err);
        const post = data[0];
        const s3res = await s3Client.send(
            new GetObjectCommand({
                Bucket: 'blogproject2023',
                Key: post.img,
            })
        );
        const url = await s3res.Body.transformToString();
        return res.status(200).json({ ...post, img: url, fileName: post.img });
    });
};

const uploadFileToS3 = async (name, file) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name,
            Body: file,
            ACL: 'public-read',
        };
        await s3Client.send(new PutObjectCommand(params));
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error;
    }
};

export const addPost = async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not authenticated!');

    jwt.verify(token, 'jwtkey', async (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        try {
            const base64 = req.body.file;

            if (base64) {
                await uploadFileToS3(req.body.fileName, base64);
            }

            const q =
                'INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)';
            const values = [
                req.body.title,
                req.body.desc,
                req.body.fileName,
                req.body.cat,
                req.body.date,
                userInfo.id,
            ];

            db.query(q, [values], (err, data) => {
                if (err) {
                    console.log(err); // Log the detailed error message
                    return res
                        .status(500)
                        .json({ error: 'Error inserting into the database' });
                }
                return res.json('Post has been created');
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Error uploading file to S3' });
        }
    });
};

export const deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not authenticated!');

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        const postId = req.params.id;
        const q = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?';

        db.query(q, [postId, userInfo.id], (err, data) => {
            if (err)
                return res.status(403).json('You can delete only your post!');

            return res.json('Post has been deleted!');
        });
    });
};

export const updatePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not authenticated!');

    jwt.verify(token, 'jwtkey', (err, userInfo) => {
        if (err) return res.status(403).json('Token is not valid!');

        const postId = req.params.id;
        const q =
            'UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?';
        const values = [
            req.body.title,
            req.body.desc,
            req.body.fileName,
            req.body.cat,
        ];

        const post = 'SELECT * FROM posts WHERE `id` = ? AND `uid` = ?';

        db.query(post, [postId, userInfo.id], async (err, data) => {
            if (err)
                return res.status(403).json('You can update only your post!');
            if (data[0].img !== req.body.fileName) {
                await uploadFileToS3(req.body.fileName, req.body.file);
            }
        });

        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json('Post has been updated.');
        });
    });
};
