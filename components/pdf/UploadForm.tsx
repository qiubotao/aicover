'use client';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { useState } from 'react';

export default function UploadForm() {
//   const [file, setFile] = useState(null);
//   const [content, setContent] = useState('');

//   const handleFileChange = (event) => {
//       setFile(event.target.files[0]);
//   };

//   const handleSubmit = async (event) => {
//     // "use server";
//       event.preventDefault();
//       if (!file) {
//           alert('Please select a PDF file to upload.');
//           return;
//       }

//       const formData = new FormData();
//       formData.append('file', file);

//       console.log("UploadForm");
//       const response = await fetch('/api/uploads', {
//           method: 'POST',
//           body: formData,
//       });
//       console.log(response);

//       if (!response.ok) {
//           alert('File upload failed.');
//           return;
//       }

//       const data = await response.json();
//       setContent(data.text);
//   };

  return (
    <FilePond
      server={{
        process: '/api/uploads',
        fetch: null,
        revert: null,
      }}
    />
  );
  }
  