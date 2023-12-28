import avatar from '../assets/icons/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { usernameValidate } from '../helper/validate'

const Username = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: 'example123'
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      navigate('/password');
      console.log(values);
    }
  });

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold text-[#ff6a6a]">Hello Stranger!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input type="text" id='username' placeholder='Username' className={styles.text_box}
                autoComplete='off' {...formik.getFieldProps('username')} />
              <button className={`${styles.btn} bg-indigo-500`} type='submit'>Let&apos;s Go</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>
                Not a Member? <Link className='text-red-500' to="/register"> Register Now </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Username;