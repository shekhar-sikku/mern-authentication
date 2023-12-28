/* eslint-disable no-unused-vars */
import styles from '../styles/Username.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { resetPasswordValidation } from '../helper/validate'


const Reset = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: 'admin@123',
      confirm_pwd: 'admin@123'
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {

      console.log('password ' + values.password);
      console.log('confirm password ' + values.confirm_pwd);
      
      // let resetPromise = 'resetPassword({ username, password: values.password }) ' + values

      // toast.promise(resetPromise, {
      //   loading: 'Updating...',
      //   success: <b>Reset Successfully...!</b>,
      //   error: <b>Could not Reset!</b>
      // });

      // resetPromise.then(function () { navigate('/password') })

    }
  })

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "35%" }}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold text-[#ff6a6a]'>Reset Password!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter new password.
            </span>
          </div>

          <form className='py-20' onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.text_box}
                type="text" placeholder='New Password' />
              <input {...formik.getFieldProps('confirm_pwd')} className={styles.text_box}
                type="text" placeholder='Repeat Password' />
              <button className={`${styles.btn} bg-indigo-500`} type='submit'>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reset;