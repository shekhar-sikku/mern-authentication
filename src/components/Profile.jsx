import styles from '../styles/Username.module.css';
import avatar from '../assets/icons/profile.png';
import convertToBase64 from '../helper/convert';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react'
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom'
import { profileValidation } from '../helper/validate';
import { updateUser } from '../helper/helper.js';
import useFetch from '../hooks/fetch.hook.js';

const Profile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });
    }
  });

  //** formik doesn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  //** logout handler function */
  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", height: "95%", padding: '2em' }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold text-[#ff6a6a]'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              You can update the details.
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={apiData?.profile || file || avatar} className={`${styles.profile_img}`} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-[90%] gap-10">
                <input {...formik.getFieldProps('firstName')} className={`${styles.text_box}`}
                  type="text" placeholder='FirstName' autoComplete='off' />
                <input {...formik.getFieldProps('lastName')} className={`${styles.text_box}`}
                  type="text" placeholder='LastName' autoComplete='off' />
              </div>

              <div className="name flex w-[90%] gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.text_box}`}
                  type="text" placeholder='Mobile No.' autoComplete='off' />
                <input {...formik.getFieldProps('email')} className={`${styles.text_box}`}
                  type="text" placeholder='Email' autoComplete='off' />
              </div>

              <div className="name flex flex-col w-[90%] gap-6">
                <input {...formik.getFieldProps('address')} className={`${styles.text_box} w-full`}
                  type="text" placeholder='Address' autoComplete='off' />
                <button className={`${styles.btn} bg-indigo-500 w-full`} type='submit'>Update</button>
              </div>

            </div>
            <div className="text-center py-4">
              <span className='text-gray-500'>
                Come Back Later?  <Link className='text-red-500' onClick={userLogout} to="/">Logout</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile;