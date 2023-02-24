import { useState } from 'react';
import './App.css';
import axios from "./axios";
import SideBar from './SideBar';
import data from "./data.json";
import Spinner from "./images/spinner-removebg-preview.png";

function App() {
  const [user, setUser] = useState(data);
  const [logged, setLogged] = useState(false);
  const [signup, setSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [vpassword, setVPassword] = useState("");
  const [name, setName] = useState("");
  async function loginHandler(event) {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      mobile,
      password
    }
    const res = await axios.post("/vinichat/loginuser", data);
    if (res.status === 200) {
      setUser(res.data);
      setLogged(true);
      setIsLoading(false);
    }
    else {
      console.log(res);
    }
  }

  async function signupHandler(event) {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      mobile,
      password,
      user: name
    }
    const res = await axios.post("/vinichat/createuser", data);
    if (res.status === 201) {
      setSignup(false);
      setIsLoading(false);
    }
    else {
      console.log(res);
    }
  }
  return (
    <div className="app">
      <div className="app_body">
        {logged ? (
          <SideBar mobile={user.mobile} user={user.user} ImgUrl={user.ImgUrl} chats={user.chats} />) : (
          signup ? (
            <div className="signup">
              <div className='signup-header'><h2>Signup</h2>
              </div>
              <form onSubmit={signupHandler}>
                <div className="login-body signup-body">
                  <center>Come! Lets Create Account</center><br />
                  Full Name :
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
                  Mobile :
                  <input type="number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder='84*******' /><br /><br />
                  Password :
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
                  Verify Password :
                  <input type="password" value={vpassword} onChange={(e) => setVPassword(e.target.value)} /><br /><br />
                </div>
                <div className='login-footer' >{isLoading ? (<button disabled><img className='spinner_img' src={Spinner} /></button>) : (<button type="submit">Signup</button>)}</div>
              </form>
              <div className='signup-header below_msg'> Returning user? click me for login <span onClick={() => setSignup(false)} style={{ "cursor": "alias" }}> &#128527;</span></div>
            </div>) : (
            <div className="login">
              <div className='login-header'><h2>Login</h2>
              </div>
              <form onSubmit={loginHandler}>
                <div className="login-body"><br />
                  Mobile : <input type="number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder='84*******' /><br /><br />
                  Password : <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
                </div>
                <div className='login-footer' >{isLoading ? (<button disabled><img className='spinner_img' src={Spinner} /></button>) : (<button type="submit">Login</button>)}</div>
              </form>
              <div className='login-header'> New user? create account clicking me <span onClick={() => setSignup(true)} style={{ "cursor": "alias" }}> &#128521;</span></div>
            </div>
          )
        )
        }
      </div >
    </div >
  );
}

export default App;
