
import '../main.css';
import logo_notfound from '../img/404-Space.svg';
import { Link } from 'react-router-dom';
  
  function not_found() {


    return (
      <div className="App">
        <div className='.container-xxl'>
        <img src={logo_notfound} className="logo_notfound" alt="logo" />
        <Link to="/" className='back_end'>Back</Link>
        </div>         
      </div>
    );
  }
  
  export default not_found;