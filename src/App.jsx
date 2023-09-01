import { useState, useEffect } from 'react'
import { useNavigate } from "react-router";
import Aos from "aos";
import undrawChore from './assets/undraw_chore_list_re_2lq8.png';
import undrawNote from './assets/undraw_Note_list_re_r4u9.png';

function App() {
  const text = ['最實用的線上代辦事項服務', '最方便的待辦事項工具'];
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [letter, setLetter] = useState('');
  const navigate = useNavigate();
  Aos.init();
  useEffect(() => { // 打字機效果
    setCurrentText(text[count]);
    if(index === currentText.length +1) {
      setTimeout(() => {
        if(count === text.length-1){
          setCount(0);
        } else{
          setCount(count + 1);
        }
        setIndex(0);
      },3000);
    }else{
      setTimeout(() => {
        setIndex(index + 1);
        setLetter(currentText.slice(0, index));
      }, 150);
    }
  },[index]);
  
  return (
    <>
      <div style={{ backgroundImage: 'linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)',height: '100vh' }} className="position-relative">
        <header className="sticky-top">
              <nav className="navbar navbar-expand-lg bg-transparent">
                  <div className="container-fluid d-flex justify-content-between">
                      <button type="button" className="btn fs-4 Baloo-Thambi" onClick={() => navigate('/')}>ONLINE TODO LIST</button>
                      <div>
                          <button type="button" className="btn btn-danger d-none d-md-inline-block" onClick={() => navigate('/register')}>免費加入</button>
                          <button type="button" className="btn" onClick={() => navigate('/login')}>登入</button>
                      </div>
                  </div>
              </nav>
          </header>
        <div className="container">
          <div className="row">
            <div className="col d-flex justify-content-center align-items-center" style={{height: '600px'}}>
              <div className="header-content d-flex flex-column" data-aos="fade-up" data-aos-duration="500">
                <h2 className="text-center Baloo-Thambi">ONLINE TODO LIST</h2>
                <h3 className="fw-bold mt-3 mb-0">
                  <span className="headerText">{letter}</span><span className="typewriter">|</span>
                </h3>
                <button type="button" className="btn btn-danger mx-auto mt-3" onClick={() => navigate('/register')}>免費加入</button>
              </div>
            </div>
          </div>
        </div>
        <img src={undrawChore} alt="undrawChore" className="position-absolute bottom-0 end-0 d-none d-md-block" />
        <img src={undrawNote} alt="undrawNote" className="position-absolute bottom-0 d-none d-md-block" />
      </div>
    </>
  )
}

export default App
