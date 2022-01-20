import React from 'react';
import Resizer from 'react-image-file-resizer';
import { Avatar, Badge } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FileUpload = ({ values, setValues, setLoading }) => {
  const user = useSelector((state) => state.user);
  const fileUploadAndResize = (e) => {
    // resize
    let files = e.target.files;
    let allUploadedFiles = values.images;
    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          'JPEG',
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  image: uri,
                },
                {
                  headers: {
                    authtoken: user ? user.token : '',
                  },
                }
              )
              .then((response) => {
                console.log('IMAGE UPLOAD RESPONSE DATA', response);
                setLoading(false);
                allUploadedFiles.push(response.data);

                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((error) => {
                console.log('CLOUDINARY UPLOAD ERROR: ', error);
                setLoading(false);
              });
          },
          'base64'
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : '',
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const { images } = values;
        let filteredImages = images.filter(
          (image) => image.public_id !== public_id
        );
        setValues({ ...values, images: filteredImages });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  return (
    <>
      <div className='row'>
        {values.images &&
          values.images.map((image) => (
            <Badge
              key={image.public_id}
              count='X'
              style={{ cursor: 'pointer' }}
              onClick={() => handleImageRemove(image.public_id)}
            >
              <Avatar
                src={image.url}
                size={80}
                shape='square'
                className='ml-3'
              />
            </Badge>
          ))}
      </div>
      <div className='row'>
        <label className='btn btn-primary btn-raised mt-3'>
          Choose File
          <input
            type='file'
            multiple
            hidden
            accept='images/*'
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
