import { useState ,useEffect} from 'react';
import './App.css';
import axios from "./axios";
import SideBar from './SideBar';
import data from "./data.json";
import Spinner from "./images/spinner-removebg-preview.png";
import Cookies from 'js-cookie';
import Cookie from "js-cookie";

function App() {
  const [user, setUser] = useState(data);
  const [logged, setLogged] = useState(false);
  const [signup, setSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [vpassword, setVPassword] = useState("");
  const [name, setName] = useState("");

  function fetchCookie(){
    try{
      if(!Cookies.get("viniUser")){
        setLogged(false);
        setUser(data);
      } else{
        setIsLoading(true);
        const userData = JSON.parse(Cookie.get("viniUser")) || null;
        setUser(data);
        user.mobile=userData["mobile"]
        user.user = userData["user"]
        setLogged(true);
        setIsLoading(false);
      }
    } catch(err){
      // console.log("HEllo")
        setLogged(false);
        setUser(data);
    }
  }
  useEffect(() => fetchCookie(), []);

  async function loginHandler(event) {
    setIsLoading(true);
    event.preventDefault();
    const data = {
      mobile,
      password
    }
    try {
      const res = await axios.post("/vinichat/loginuser", data);
      if (res.status === 200) {
        Cookies.set("viniUser",JSON.stringify({'mobile':res.data.mobile,'user':res.data.user,'password':password}));
        setUser(res.data);
        setMobile("");
        setPassword("");
        setLogged(true);
        setIsLoading(false);
      }
      else {
        console.log(res);
      }
    } catch (err) {
      alert("Something went wrong, try again!")
    }
    setIsLoading(false);
  }

  async function signupHandler(event) {
    setIsLoading(true);
    event.preventDefault();
    if (mobile.length === 10) {
      if (password === vpassword) {
        const data = {
          mobile,
          password,
          user: name
        }
        try {
          const res = await axios.post("/vinichat/createuser", data);
          if (res.status === 201) {
            setSignup(false);
            setIsLoading(false);
          } else {
            console.log(res);
            alert("Something went wrong, try again!")
          }
          alert("User Added successfully")
        } catch (err) {
          alert("Something went wrong, try again!")
        }
      } else {
        alert("Passwords dosen't match")
      }
    } else {
      // console.log(mobile.length)
      alert("Mobile number sholud be only 10 digits")
    }

    setIsLoading(false);
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
                  <center style={{ marginLeft: "-50px" }}>Come! Lets Create Account</center><br />
                  Full Name :
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ "margin-left": "56px" }} required /><br /><br />
                  Mobile :
                  <input type="mob" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder='84*******' style={{ "margin-left": "74px" }} required /><br /><br />
                  Password :
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ "margin-left": "60px" }} required /><br /><br />
                  Verify Password :
                  <input type="password" value={vpassword} onChange={(e) => setVPassword(e.target.value)} style={{ "margin-left": "24px" }} required /><br /><br />
                </div>
                <div className='login-footer' >{isLoading ? (<button disabled><img className='spinner_img' src={Spinner} alt="" /></button>) : (<button type="submit">Signup</button>)}</div>
              </form>
              <div className='signup-header below_msg'> Returning user? click me for login <span onClick={() => setSignup(false)} style={{ "cursor": "alias" }}> &#128527;</span></div>
            </div>) : (
            <div className="login">
              <div className='login-header'><h2>Login</h2>
              </div>
              <form onSubmit={loginHandler}>
                <div className="login-body"><br />
                  Mobile : <input type="number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder='84*******' style={{ "margin-left": "40px" }} required /><br /><br />
                  Password : <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ "margin-left": "26px" }} required /><br /><br />
                </div>
                <div className='login-footer' >{isLoading ? (<button disabled><img className='spinner_img' src={Spinner} alt="" /></button>) : (<button type="submit">Login</button>)}</div>
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
