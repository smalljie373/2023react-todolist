import Vector from '../assets/Vector.png';
import Todolistimg from '../assets/img.png';
import Aos from "aos";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router";

function RegisterPage() {
    Aos.init();
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API;
    const Myswal = withReactContent(Swal);
    const [form, setForm] = useState({
        email: '',
        password: '',
        nickname: '',
    });
    const [confirmpasswod, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if(form.password !== confirmpasswod) {
            Myswal.fire({
                icon: 'error',
                title: '發生錯誤',
                text: '密碼不一致!',
            });
            setIsLoading(false);
            return;
        }
        try{
            const res = await axios.post(`${apiUrl}/users/sign_up`, form);
            Myswal.fire({
                icon: 'success',
                title: '註冊成功',
                text: `3秒後，將轉移到登入頁面!`,
                showConfirmButton: false,
                timer: 3000,
            });
            setTimeout(() => {
                navigate('/login');
                setIsLoading(false);
            },3000)
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
            nickname: '',
        });
        setConfirmPassword('');
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
                                <form className='container' onSubmit={(e) => register(e)}>
                                    <div className="form-group pt-4">
                                        <label htmlFor="registrationEmail" className='form-label'>Email</label>
                                        <input type="email" name="email" id="registrationEmail" placeholder="請輸入Email" value={form.email} className='form-control' onChange={(e) => handleInput(e)} required/>
                                    </div>
                                    <div className="form-group pt-4">
                                        <label htmlFor="registrationName" className='form-label'>您的暱稱</label>
                                        <input type="text" name="nickname" id="registrationName" placeholder="請輸入您的暱稱" value={form.nickname} className='form-control' onChange={(e) => handleInput(e)} required/>
                                    </div>
                                    <div className="form-group pt-4">
                                        <label htmlFor="registrationpassword" className='form-label'>密碼</label>
                                        <input type="password" name="password" id="registrationpassword" placeholder="請輸入密碼" value={form.password} className='form-control' onChange={(e) => handleInput(e)} required/>
                                    </div>
                                    <div className="form-group pt-4">
                                        <label htmlFor="passwordConfirm" className='form-label'>再次輸入密碼</label>
                                        <input type="password" id="passwordConfirm" value={confirmpasswod} placeholder="請再次輸入密碼" className='form-control' onChange={(e) => {setConfirmPassword(e.target.value)}} required/>
                                    </div>
                                    <div className="d-flex col-4 mx-auto mt-3 flex-column">
                                        <button type='submit' className='btn btn-danger' disabled={isLoading}>註冊帳戶</button>
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

export default RegisterPage;