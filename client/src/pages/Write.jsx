import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const Write = () => {
    const state = useLocation().state;
    const [value, setValue] = useState(state?.desc || '');
    const [title, setTitle] = useState(state?.title || '');
    const [file, setFile] = useState(null);
    const [cat, setCat] = useState(state?.cat || '');

    const navigate = useNavigate();

    const convertBase64 = (file) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

    const handleClick = async (e) => {
        e.preventDefault();

        let base64Image = null;

        if (file) {
            try {
                base64Image = await convertBase64(file);
            } catch (err) {
                console.log(err);
            }
        }

        try {
            state
                ? await axios.put(`/posts/${state.id}`, {
                      title: title || state.title,
                      desc: value || state.desc,
                      cat: cat || state.cat,
                      file: base64Image || state.img,
                      fileName: file?.name || state.fileName,
                  })
                : await axios.post('/posts/', {
                      title,
                      desc: value,
                      cat,
                      file: base64Image,
                      fileName: file?.name || '',
                      date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                  });
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    console.log('Title:', title);

    return (
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="editorContainer">
                    <ReactQuill
                        className="editor"
                        theme="snow"
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <h1>Publish</h1>
                    <span>
                        <b>Status: </b> Draft
                    </span>
                    <span>
                        <b>Visibility: </b> Public
                    </span>
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        id="file"
                        name=""
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                    />
                    <label className="file" htmlFor="file">
                        Upload Image
                    </label>
                    <div className="buttons">
                        <button>Save as a draft</button>
                        <button onClick={handleClick}>Publish</button>
                    </div>
                </div>
                <div className="item">
                    <h1>Category</h1>
                    <div className="cat">
                        <input
                            type="radio"
                            style={{ accentColor: '#BA3B0A' }}
                            checked={cat === 'art'}
                            name="cat"
                            value="art"
                            id="art"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="art">Art</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            style={{ accentColor: '#BA3B0A' }}
                            checked={cat === 'science'}
                            name="cat"
                            value="science"
                            id="science"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="science">Science</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            style={{ accentColor: '#BA3B0A' }}
                            checked={cat === 'technology'}
                            name="cat"
                            value="technology"
                            id="technology"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="technology">Technology</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            style={{ accentColor: '#BA3B0A' }}
                            checked={cat === 'cinema'}
                            name="cat"
                            value="cinema"
                            id="cinema"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="cinema">Cinema</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            style={{ accentColor: '#BA3B0A' }}
                            checked={cat === 'design'}
                            name="cat"
                            value="design"
                            id="design"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="design">Design</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            style={{ accentColor: '#BA3B0A' }}
                            checked={cat === 'food'}
                            name="cat"
                            value="food"
                            id="food"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="food">Food</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Write;
