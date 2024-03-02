import { NextRequest, NextResponse } from 'next/server'; // To handle the request and response
import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename
import PDFParser from 'pdf2json'; // To parse the pdf
import { currentUser } from "@clerk/nextjs";
import { respData, respErr } from "@/lib/resp";

import { Document } from "@/types/document";
import {  insertDocument,getDocumnetCount } from "@/models/document";


// import { createClient } from '@/utils/supabase/server';
// import { cookies } from 'next/headers';
// import { Suspense } from 'react';

export async function POST(req: NextRequest) {

  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return respErr("no auth");
  }
  const user_email = user.emailAddresses[0].emailAddress;


  const formData: FormData = await req.formData();
  console.log(formData);
  const uploadedFiles = formData.getAll('filepond');
  console.log("uploadedFiles" + uploadedFiles);
  let fileName = '';
  let parsedText = '';

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[1];
    console.log('Uploaded file:', uploadedFile);

    // Check if uploadedFile is of type File
    if (uploadedFile instanceof File) {
      // Generate a unique filename
      fileName = uuidv4();

      // Convert the uploaded file into a temporary file
      const tempFilePath = `/tmp/${fileName}.pdf`;

      // Convert ArrayBuffer to Buffer
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

      // Save the buffer as a file
      await fs.writeFile(tempFilePath, fileBuffer);

      // Parse the pdf using pdf2json. See pdf2json docs for more info.

      // The reason I am bypassing type checks is because
      // the default type definitions for pdf2json in the npm install
      // do not allow for any constructor arguments.
      // You can either modify the type definitions or bypass the type checks.
      // I chose to bypass the type checks.
      const pdfParser = new (PDFParser as any)(null, 1);

      // See pdf2json docs for more info on how the below works.
      pdfParser.on('pdfParser_dataError', (errData: any) =>
        console.log(errData.parserError)
      );

      pdfParser.on('pdfParser_dataReady', () => {
        // console.log((pdfParser as any).getRawTextContent());
        parsedText = (pdfParser as any).getRawTextContent();
        console.log("name "+uploadedFile.name);
        //  save(parsedText);
        saveDocument(user_email,uploadedFile.name);
        console.log("count" +  Number(getDocumnetCount()));
      });

      pdfParser.loadPDF(tempFilePath);
      
    } else {
      console.log('Uploaded file is not in the expected format.');
    }
  } else {
    console.log('No files found.');
  }

  const response = new NextResponse(parsedText);
  response.headers.set('FileName', fileName);
  return response;
}

async function  saveDocument(user_email: string ,fileName: string){
  console.log("start insert ");
  const document: Document = {
    user_email: user_email,
    title: fileName,
    status: "SUCCESS",
  };
  await insertDocument(document);
}


// async function  save(parsedText){
//   console.log("start");
//   const cookieStore = cookies()
//   const supabase = createClient(cookieStore);
//   // const { data: notes } = await supabase.from("notes").select();
//   const documentId = uuidv4();
//   const { data, error } = await supabase
//       .from("documents")
//       .insert([{ documentid: 123, userid : "123",title: "333",uploadtime : Date, status: "INIT" }
//     ])

//   if (error) console.error('添加记录出错', error)
//   else console.log('添加记录成功', data)
//   // Suspense.
//   return ;
// }



// async function  saveDocument(userId, titleName){
//   console.log("start");
//   const cookieStore = cookies()
//   const supabase = createClient(cookieStore);
//   // const { data: notes } = await supabase.from("notes").select();
//   const documentId = uuidv4();
//   const { data, error } = await supabase
//       .from("documents")
//       .insert([{  userid : userId,title: titleName, status: "INIT" }
//     ])

//   if (error) console.error('添加记录出错', error)
//   else console.log('添加记录成功', data)
//   // Suspense.
//   return ;
// }