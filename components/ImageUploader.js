/* import the ipfs-http-client library */
import { create } from 'ipfs-http-client';
import { useEffect, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone'

export const ImageUploader = ({onUploaded, onCancelled}) => {

    const [image, setImage] = useState(null);

    //
    // Upload the IPFS
    // @return { String } IPFS file path
    // 
    const uploadToIPFS = async (data) => {
        /* Create an instance of the client */
        const client = create('https://ipfs.infura.io:5001/api/v0')
        
        const res = await client.add(data)

        return 'https://ipfs.io/ipfs/' + res.path;
    }

    // 
    // Upload, setStates, and callback
    // 
    const upload = async (file) => {

        const imagePath = await uploadToIPFS(file);

        // -- local state
        setImage(imagePath)
        
        // -- callback
        onUploaded(imagePath);

        return imagePath;
    }
    
    //
    // event: when the "attach a file" button is clicked
    // @param { Event } e : clicked event from the input
    // @return { void } 
    //
    const onClickUpload = async (e) => {
        
        const file = e.target.files[0];
        
        console.log("onClickUpload: ", file);
        
        // await upload(file);
    }

    // 
    // reset local states and callbacl
    // @return { void }
    //
    const cancel = async () => {
        setImage(null);
        onCancelled();
    }

    //
    // event: when a file is being dragged to the drop zone
    // @param { Array } accepted files callback from the input
    // @return { void } 
    //
    const onDrop = useCallback(async acceptedFiles => {
        
        // Do something with the files
        const file = acceptedFiles[0];

        // -- modified to the format that IPFS accepts
        // NOTE: baiscally removed "path" property from the file
        var f = new File([file], file.path, {
            type: file.type, 
            lastModified: file.lastModified, 
            size: file.size,
            lastModifiedDate: file.lastModifiedDate,
            webkitRelativePath: file.webkitRelativePath
        })
        await upload(f);

      }, [])
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    return (
        <div className="rounded-lg shadow-xl bg-gray-50 relative">
            <div className="m-4 pt-2 pb-2">
                <label className="inline-block mb-2 text-gray-500">File Upload</label>
                <div {...getRootProps()}>
                <input {...getInputProps()} />
                    {
                        image == null
                        ? <>
                            <div className="flex items-center justify-center w-full pb-2 ">
                                <div className="cursor-pointer flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                    <div className="flex flex-col items-center justify-center pt-7">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                            { isDragActive ? 'Uploading' : 'Click to attach a file' }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                        : <>
                            <div onClick={() => cancel()} className='absolute right-0 p-2 cursor-pointer top-0'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#FF3743">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className='text-center rounded-lg overflow-hidden w-48 mx-auto mb-2'>
                                <img className="object-cover" src={image} />
                            </div>
                        </> 
                    }
                </div>
            </div>
        </div>

    );
}

export default ImageUploader;