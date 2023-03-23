import { useForm } from "react-hook-form";
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import logo from '../img/App.svg';
import { Link } from 'react-router-dom';
import logoS from '../img/logoS.svg';
import '../main.css';


interface FormData {
  nick_name: string;
  inp_m: string;
  pass_acc_first: string;
  pass_acc_again: string;
}

function reg() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('nick_name', data.nick_name);
    formData.append('inp_m', data.inp_m);
    formData.append('pass_acc_first', data.pass_acc_first);
    formData.append('pass_acc_again', data.pass_acc_again);

    axios.post('http://localhost:8000/submit', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="App_reg">
      <div className="container-sm">
        <div className='center_reg'>
          <CardGroup>
            <Card className="card-color1">
              <Card.Body>
                <Link to="/">
                  <img src={logo} className="App-logo" alt="logo" />
                </Link>
                <Card.Title className="title_card">Sign-up</Card.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="form_inp">
                  <input
                    type="text"
                    {...register("nick_name", { required: true, minLength: 3, pattern: /^[a-zA-Zа-яА-ЯёЁ0-9]{3,}$/u })}
                    placeholder="name" />
                  {errors.nick_name?.type === "required" && <span className="warning_str">required field</span>}
                  {errors.nick_name?.type === "minLength" && <span className="warning_str">must be at least 3 characters</span>}
                  {errors.nick_name?.type === "pattern" && <span className="warning_str">name can contain only letters of the Latin alphabet, as well as numbers</span>}
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
                  {(errors.pass_acc_again?.type === "required" || errors.pass_acc_again?.type === "validate") && <span className="warning_str">password mismatch</span>}
                  <input
                    type="password"
                    {...register("pass_acc_again", { required: true, validate: (value) => value === watch("pass_acc_first") })}
                    placeholder="pass" />
                  <button className="btn_reg" type="submit">Register</button>
                </form>
              </Card.Body>
            </Card>
            <Card className="card-color2">
              <Card.Body>
                <Link to="/" className='fix_position'>
                  <img src={logoS} className="logo_S" alt="logo" />
                </Link>
                <h5 className='header_register_text'>Pulvinar efficitur mattis venenatis arcu pulvinar.</h5>
                <h6 className='body_register_text_info'>Pellentesque in imperdiet.</h6>
                <h5 className='footer_register_text'>Lorem sit non est. Tempu.</h5>
              </Card.Body>
            </Card>
          </CardGroup>
        </div>
      </div>
    </div>

  );

}
export default reg;

