import Vector from '../assets/Vector.png';
import Todolistimg from '../assets/img.png';
import Aos from "aos";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router";
function LoginPage() {
    Aos.init(); // 初始化Aos
    const apiUrl = import.meta.env.VITE_API;
    const Myswal = withReactContent(Swal);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = async (e) => { // 登入
        e.preventDefault();
        setIsLoading(true);
        try{
            const res = await axios.post(`${apiUrl}/users/sign_in`, form);
            Myswal.fire({
                icon: 'success',
                title: '登入成功',
                text: `歡迎${res.data.nickname}，3秒後將轉移畫面!`,
                showConfirmButton: false,
                timer: 3000,
            });
            setTimeout(() => {
                const token = res.data.token;
                const username = res.data.nickname;
                document.cookie = `todoToken=${token};  max-age=1200`;
                document.cookie = `username=${username}; max-age=1200`;
                navigate('/todolist');
                setIsLoading(false);
            },3000);
        }catch(error){
            Myswal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: error.response.data.message,
            });
            setIsLoading(false);
        }
        setForm({
            email: '',
            password: '',
        });
    }
    function handleInput(e) {
        setForm({...form,[e.target.name] : e.target.value});
    }
    return (
        <>
            <div style={{ backgroundImage: 'linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)',height: '100vh' }}>
                <header className="sticky-top">
                <nav className="navbar navbar-expand-lg bg-transparent">
                    <div className="container-fluid d-flex justify-content-between">
                        <button type="button" className="btn fs-4 Baloo-Thambi" onClick={() => navigate('/')}>ONLINE TODO LIST</button>
                </div>
            </nav>
                </header>
                <main className='container pt-5 pt-md-7'>
                    <div className="row">
                        <div className="col-6 me-5 d-none d-md-block" data-aos="fade-right">
                            <h1 className="h2 Baloo-Thambi fw-bold text-center">
                                <img src={Vector} alt="Vectorimg" />
                                ONLINE TODO LIST
                            </h1>
                            <img src={Todolistimg} alt="Todolist_img" className='d-block m-auto img-fluid' />
                        </div>
                        <div className="col">
                            <h2 className="h3 fw-bold mt-5 ps-2 d-none d-md-block" data-aos="fade-up">最實用的線上代辦事項服務</h2>
                            <div className="d-block d-md-none text-center" data-aos="fade-up">
                                <h2 className='h1 fw-bold text-center Baloo-Thambi'>
                                    <img src={Vector} alt="Vectorimg" />
                                    ONLINE TODO LIST
                                </h2>
                                <h3 className="fw-bold mt-3">最實用的線上代辦事項服務</h3>
                            </div>
                            <div className="Authentication" data-aos="fade-up">
                                <form className='container' onSubmit={(e) => login(e)}>
                                    <div className="form-group pt-4">
                                        <label htmlFor="loginEmail" className='form-label'>Email</label>
                                        <input type="email" name="email" value={form.email} id="loginEmail" placeholder="請輸入Email" className='form-control' required
                                        onChange={(e) => handleInput(e)} />
                                    </div>
                                    <div className="form-group pt-4">
                                        <label htmlFor="loginpassword" className='form-label'>密碼</label>
                                        <input type="password" name="password" value={form.password} id="loginpassword" placeholder="請輸入密碼" className='form-control' required
                                        onChange={(e) => handleInput(e)}/>
                                    </div>
                                    <div className="d-flex col-4 mx-auto mt-3 flex-column">
                                        <button type='submit' className='btn btn-danger' disabled={isLoading}>登入</button>
                                        <p className='mb-0 mt-2 text-center'>沒有帳戶？<button type='button' className='btn btn-link pt-1 px-0' onClick={(e) => {e.preventDefault();navigate('/register')}}>註冊</button></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default LoginPage;