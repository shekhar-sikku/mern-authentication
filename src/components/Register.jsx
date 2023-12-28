import styles from '../styles/Username.module.css';
import avatar from '../assets/icons/profile.png';
import convertToBase64 from '../helper/convert';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import { registerUser } from '../helper/helper.js';

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || '' })

      // console.log(values);
      let registerPromise = registerUser(values);

      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>
      });

      registerPromise.then(function () { navigate('/') });
    }
  })

  /** formik doesn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", height: "95%", padding: '2em' }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold text-[#ff6a6a]'>Register User!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Happy to join you!
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('email')} className={styles.text_box}
                type="text" placeholder='Email*' autoComplete='off' />
              <input {...formik.getFieldProps('username')} className={styles.text_box}
                type="text" placeholder='Username*' autoComplete='off' />
              <input {...formik.getFieldProps('password')} className={styles.text_box}
                type="text" placeholder='Password*' autoComplete='off' />
              <button className={`${styles.btn} bg-indigo-500`} type='submit'>Register</button>
            </div>
            <div className="text-center py-4">
              <span className='text-gray-500'>
                Already Registered? <Link className='text-red-500' to="/">Login Now</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register;