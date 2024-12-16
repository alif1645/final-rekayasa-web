import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

function Posts({ posts }) {
    // State untuk menyimpan daftar post lokal
    const [localPosts, setLocalPosts] = useState(posts);

    // State form untuk title dan content
    const { data, setData, post, put, errors, delete: destroy } = useForm({
        title: "",
        content: "",
    });

    // State untuk mengetahui apakah sedang edit
    const [editId, setEditId] = useState(null);

    // Fungsi untuk menambah atau mengupdate post
    function submit(e) {
        e.preventDefault();

        if (editId) {
            // Update post
            put(`/posts/${editId}`, {
                onSuccess: (response) => {
                    const updatedPost = response.props.post;
                    setLocalPosts(
                        localPosts.map((post) =>
                            post.id === editId ? updatedPost : post
                        )
                    );
                    setEditId(null);
                    setData({ title: "", content: "" });
                },
            });
        } else {
            // Tambah post baru
            post("/posts", {
                onSuccess: (response) => {
                    const newPost = response.props.post;
                    setLocalPosts([...localPosts, newPost]);
                    setData({ title: "", content: "" });
                },
            });
        }
    }

    // Fungsi untuk memulai edit post
    function startEdit(id, title, content) {
        setEditId(id);
        setData({ title, content });
    }

    // Fungsi untuk menghapus post
    function submitDelete(id, e) {
        e.preventDefault();

        destroy(`/posts/${id}`, {
            onSuccess: () => {
                setLocalPosts(localPosts.filter((post) => post.id !== id));
            },
        });
    }

    return (
        <div className="max-w-[600px] mx-auto flex flex-col gap-7 p-4 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-center mt-6 text-purple-600">
                Postingan
            </h3>

            {/* Form untuk menambah atau mengupdate post */}
            <form
                onSubmit={submit}
                className="flex flex-col gap-4 bg-white shadow-md rounded-md p-6"
            >
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    className={`w-full p-3 border ${
                        errors.title
                            ? "border-2 border-red-500"
                            : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring focus:ring-purple-300`}
                    placeholder="Judul Post"
                />
                <textarea
                    rows="5"
                    value={data.content}
                    onChange={(e) => setData("content", e.target.value)}
                    className={`w-full p-3 border ${
                        errors.content
                            ? "border-2 border-red-500"
                            : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring focus:ring-purple-300`}
                    placeholder="Isi Post"
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
                >
                    {editId ? "Save" : "Tambah Post"}
                </button>
            </form>

            {/* Daftar Post */}
            <div className="flex flex-col gap-4">
                {localPosts.map((post) => (
                    <div
                        key={post.id}
                        className="w-full bg-white p-4 shadow-md rounded-md transition-transform transform hover:scale-105"
                    >
                        <h2 className="font-semibold text-lg">
                            {post.title}
                        </h2>
                        <p className="text-gray-800 mb-4">{post.content}</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => startEdit(post.id, post.title, post.content)}
                                className="text-purple-500 hover:underline"
                            >
                                Edit Post
                            </button>
                            <form onSubmit={(e) => submitDelete(post.id, e)}>
                                <button
                                    type="submit"
                                    onClick={() => submitDelete(post.id, e)}
                                    className="text-red-500 hover:underline"
                                >
                                    Hapus Post
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Posts;
