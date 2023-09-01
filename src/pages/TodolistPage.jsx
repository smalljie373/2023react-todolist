import Empty from '../assets/empty.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router";

function TodolistPage() {
    const blank = /^[\s]/g;
    const category = ['全部', '待完成', '已完成'];
    const Myswal = withReactContent(Swal);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [todo,setTodo] = useState([]); // 原始todo存放
    const [form ,setForm] = useState({
        content: '',
    });
    const [changeMode , setChangeMode] = useState(false);
    const [newTodo, setNewTodo] = useState('');
    const [filteredType, setFilteredType] = useState('全部');
    const apiUrl = import.meta.env.VITE_API;

    const changetodo = todo?.filter((item) => 
        filteredType === '待完成' ? !item.status : filteredType === '已完成' ? item.status : item
    ) // 篩選todolist


    const getTodo = async () => { // 取得資料
        try{
            const res = await axios.get(`${apiUrl}/todos/`);
            setTodo(res.data.data);
        }catch(error){
            Myswal.fire({
                icon: 'error',
                title: '獲取代辦清單失敗!',
            });
        }
    }

    const addTodo = async () => { // 新增todo
        try{
            const res = await axios.post(`${apiUrl}/todos/`,form);
            Myswal.fire({
                icon: 'success',
                title: '新增完畢',
                text: `以新增${res.data.newTodo.content}`,
                showConfirmButton: false,
                timer: 1000,
            });
            setTimeout(() => {
                getTodo();
                setForm({content: ''});
                setFilteredType('全部');
            },1000);
        }catch(error){
            console.log(error);
        }
    }

    function checkSame(e) {
        e.preventDefault();
        if (form.content === '' || blank.test(form.content)) {
            Myswal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: '你要新增的項目前方與項目本身不可為空 !',
            });
            return;
        }
        const check = todo.some((item) => item.content === form.content.trim()); // 檢查是否有重複新增項目
        if (check) {
            Myswal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: '此待辦您已輸入過，請重新輸入 !',
            });
            setForm({content: ''});
        }else {
            addTodo();
        }
    }

    const toggleTodo = async (id) => { // 變更狀態
        try{
            const res = await axios.patch(`${apiUrl}/todos/${id}/toggle`);
            getTodo();
            
        }catch(error){
            Myswal.fire({
                icon: 'error',
                text: '變更清單狀態失敗!',
            })
        }
    }

    const removeTodo = async (id,e) => { // 編輯清單
        e.preventDefault();
        try {
            if(!changeMode){
                const filterId = todo.filter((item) => item.id === id);
                setNewTodo(filterId);
                setChangeMode(true);
            } else{
                const check = todo.filter((item) => item.id === id)?.[0]?.content === newTodo?.[0]?.content ? true : false; // 偵測項目是否有被更改
                if(check) {
                    setChangeMode(false);
                    return;
                } else{
                    const res = await axios.put(`${apiUrl}/todos/${id}`,{ content: newTodo?.[0]?.content });
                    Myswal.fire({
                        icon: 'success',
                        title: '更新清單選項',
                        text: res.data.message,
                    });
                    getTodo();
                    setChangeMode(false);
                }
            }
        }catch(error){
            console.log(error);
        }
    }


    function delTodo(item) {
        Myswal.fire({
            icon: 'warning',
            title: '刪除清單選項',
            text: `是否刪除${item.content} 這個清單!`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確認',
            cancelButtonText: '取消',
        }).then((result) => {
            if(result.isConfirmed) {
                axios.delete(`${apiUrl}/todos/${item.id}`)
                    .then((res) => {
                        Myswal.fire({
                            icon: 'success',
                            title: `${res.data.message}`,
                        })
                        getTodo();
                    })
            }
        })
    }

    function delTodoAll() {
        const deleteItems = todo.filter((item) => item.status !== false)
                    .map((item) => item.id);
        if (deleteItems.length === 0) {
            return;
        }
        Myswal.fire({
            icon: 'warning',
            title: '刪除清單全部選項',
            text: `是否刪除所有勾選的清單!`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確認',
            cancelButtonText: '取消',
        }).then((result) => {
            if(result.isConfirmed) {
                const deletePromises = deleteItems.map((item) => axios.delete(`${apiUrl}/todos/${item}`));
                Promise.all(deletePromises)
                    .then((res) => {
                        getTodo();
                        Myswal.fire({
                            icon: 'success',
                            title: '刪除完畢',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    })
            }
        })
    }
    

    const tokenChecking = async () => { // 驗證登入狀態
        try{
            const cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)todoToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
            const cookieName = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, '$1');
            setToken(cookieToken);
            setName(cookieName);
            axios.defaults.headers.common['Authorization'] = cookieToken; // 預設axios表頭
            const res = await axios.get(`${apiUrl}/users/checkout`);
            if(res.data.status){
                getTodo();
            }
        }catch(error){
            Myswal.fire({
                icon: 'error',
                title: '登入錯誤',
                text: '登入時間過時或還未登入',
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                navigate('/login');
            },1500);
        }
    }

    const logOut = async() => { // 使用者登出
        try{
            const res = axios.post(`${apiUrl}/users/sign_out`);
            Myswal.fire({
                icon: 'success',
                title: '使用者登出',
                text: `感謝${name}的使用~`,
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                setToken('');
                setName('');
                document.cookie = 'todoToken=;  max-age=0';
                document.cookie = 'username=; max-age=0';
                navigate('/');
            },1500);
        }catch(error){
            return;
        }
    }

    useEffect(() => {
        tokenChecking();
    },[]);

    return (
        <>
            <div style={{ backgroundImage: 'linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)',height: '100vh' }}>
                <header className="sticky-top">
                    <nav className="navbar navbar-expand-lg bg-transparent">
                        <div className="container-fluid d-flex justify-content-between">
                            <h1 className='class=" fs-4 fw-bold text-center mb-0"'>ONLINE TODO LIST</h1>
                            <div className="header_logout d-flex align-items-center">
                                {token === '' ? <><button type='button' className='btn btn-success me-3'>登入</button><button type='button' className='btn btn-danger'>註冊</button></> : 
                                <><h2 className='h4 d-none d-md-block mb-0 mx-2'>{name}的代辦</h2><button type='button' className='btn btn-danger' onClick={() => logOut()}>登出</button></>}
                            </div>
                    </div>
                </nav>
                </header>
                <main className="container col-12 col-md-8 col-lg-5 p-4 mx-auto">
                    <form className='search-bar' onSubmit={(e) => checkSame(e)}>
                        <input type="text" id="todoInput" className="form-control p-3" value={form.content} maxLength={15} placeholder="新增待辦事項" onChange={(e) => setForm({content: e.target.value})} required />
                        <button className="search-btn" id="addTodo_btn" type="submit">
                            <i className="bi bi-plus-square-fill"></i>
                        </button>
                    </form>
                    {todo.length === 0 ? <><div className="empty d-flex flex-column align-items-center mt-5">
                        <h2 className="h5 pt-6 mt-1 fw-bold">目前尚無待辦事項</h2>
                        <img src={Empty} alt="emptyimg" />
                    </div></> : <><div className="todoList mt-4">
                        <ul className="nav nav_bar nav-fill justify-content-center">
                            {category.map((item) => (
                                <li key={item} className={filteredType === item ? 'options active' : 'options'} onClick={() => setFilteredType(item)}>{item}</li>
                            ))}
                        </ul>
                        <div className="content">
                            <ul className="list px-0">
                                {changetodo?.map((item) => (
                                    <li className="d-flex align-items-center justify-content-between" key={item.id}>
                                    <div className="form-check d-flex align-items-center">
                                        <input type="checkbox" className="form-check-input ms-2 me-3" style={{ width: '20px', height: '20px', }} value={Boolean(item.status)} checked={Boolean(item.status)}  onChange={() => toggleTodo(item.id)} />
                                        {changeMode && item.id === newTodo?.[0]?.id ? (<input type='text' className="form-control" value={newTodo?.[0]?.content} maxLength={15} onChange={(e) => {
                                            const newList = newTodo?.map((item) => ({
                                                ...item,
                                                content: e.target.value.replace(' ', ''),
                                            }));
                                            setNewTodo(newList);
                                        }}  />) : (<label className={item.status ? 'text-decoration-line-through mt-1' : 'form-check-label mt-1'}>{item.content}</label>)}
                                        
                                    </div>
                                    <div>
                                        <button className='btn' onClick={(e) => {changeMode && item.id !== newTodo?.[0]?.id ? Myswal.fire({icon: 'error',text:'請先保存正在編輯的項目!',}) : removeTodo(item.id,e)}}><i className={ changeMode && item.id === newTodo?.[0]?.id  ? 'bi bi-journal-check' : 'bi bi-pencil-fill' }></i></button>
                                        <button className="btn-delete" onClick={() => delTodo(item)}><i className="bi bi-x-lg"></i></button>
                                    </div>
                                    
                                </li>
                                ))}
                                
                            </ul>
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-4">
                            <div className="item_count"><span>{todo?.filter((item) => !item.status).length}</span>個待完成項目</div>
                            <button type='button' className='btn btn-outline-danger' onClick={() => delTodoAll()}>清除已完成項目</button>
                        </div>
                    </div></>}
                </main>
            </div>
        </>
    )
}

export default TodolistPage;