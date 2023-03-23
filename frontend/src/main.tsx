import { Routes, Route, Link } from 'react-router-dom';
import logo from './img/App.svg';
import './main.css';
import { useForm } from "react-hook-form";
import Registration from './reg_on/registration';
import { Navigate } from 'react-router-dom';
import NotFound from './not_found/not_found';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import axios from 'axios';
import logoS from './img/logoS.svg';
import { IonIcon } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import { useState } from 'react';


function Main() {

  interface form_login {
    inp_m: string;
    pass_acc_first: string;
  }

  interface ResponseData {
    text: string;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<form_login>();
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  const onSubmit = (data: form_login) => {
    const form_login = new FormData();
    form_login.append('inp_m', data.inp_m);
    form_login.append('pass_acc_first', data.pass_acc_first);
  
    axios.post('http://localhost:8000/', form_login)
      .then(response => {
        setResponseData(response.data);
        console.log(response.data);
        const responseData = response.data.toLowerCase();
        if (responseData.includes("user_found")) {
          console.log("use_auth");
        } else if (responseData.includes("user_notfound")) {
          setResponseData({ text: "erroruser" });
        }
      });
  }

  return (
    <div className="App_reg">
      <div className="container-sm">
        <div className='center_reg'>
          <Routes>
            <Route path="/" element={
              <CardGroup>
                <Card className="card-color1">
                  <Card.Body>
                    <Link to="/">
                      <img src={logo} className="App-logo" alt="logo" />
                    </Link>
                    <Card.Title className="title_card">Sign-in</Card.Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="form_inp">
                      <input
                        type="email"
                        {...register("inp_m", { required: true })}
                        placeholder="email" />
                      {errors.inp_m && <span className="warning_str">enter your email</span>}
                      <input
                        type="password"
                        {...register("pass_acc_first", { required: true, pattern: /^(?=.*[A-Za-zА-Яа-яёЁ])(?=.*\d)[A-Za-zА-Яа-яёЁ\d]{6,}$/ })}
                        placeholder="pass"
                        lang="ru" />
                      {errors.pass_acc_first?.type === "pattern" && <span className="warning_str">password must contain at least 6 characters</span>}

                      <button className="btn_reg" type="submit">Sign-in<IonIcon className='ic_log' icon={logInOutline}></IonIcon></button>
                    </form>
                    {responseData && (
                      <div className="response-data">
                        <pre>{JSON.stringify(responseData, null, 2).replace(/"/g, "")}</pre>
                      </div>
                    )}
                  </Card.Body>
                </Card>
                <Card className="card-color2">
                  <Card.Body className='header_register'>
                    <Link to="/" className='fix_position'>
                      <img src={logoS} className="logo_S" alt="logo" />
                    </Link>
                    <h5 className='header_register_text'>Pulvinar efficitur mattis venenatis arcu pulvinar.</h5>
                    <h6 className='body_register_text_info'>Pellentesque in imperdiet.</h6>
                    <h5 className='footer_register_text'>Lorem sit non est. Tempu.</h5>
                    <Link to="/registration" className='reg_btn_link'>Sign-up</Link>
                  </Card.Body>
                </Card>
              </CardGroup>
            } />

            <Route path="/registration" element={<Registration />} />
            <Route path="*" element={<Navigate replace to="/page/notfound" />} />
            <Route path="/page/notfound" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </div>

  );

}

export default Main;