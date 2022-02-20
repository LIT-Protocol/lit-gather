/* import the ipfs-http-client library */
import { create } from 'ipfs-http-client';
import { useEffect, useState } from 'react';

export const ImageUploader = ({onUploaded, onCancelled}) => {

    const [image, setImage] = useState(null);
    
    const ipfsUpload = async (e) => {
        console.log("ipfsUpload: ", e.target.value);
        const fileSource = e.target.files[0];

        /* Create an instance of the client */
        const client = create('https://ipfs.infura.io:5001/api/v0')

        /* or a string */
        const res = await client.add(fileSource)

        const imagePath = 'https://ipfs.io/ipfs/' + res.path;
        
        setImage(imagePath)
        
        onUploaded(imagePath);

        return imagePath;

    }

    const cancel = async () => {
        setImage(null);
        onCancelled();
    }

    return (
        <div className="rounded-lg shadow-xl bg-gray-50 relative">
            <div className="m-4 pt-2">
                <label className="inline-block mb-2 text-gray-500">File Upload</label>
                <div className="flex items-center justify-center w-full pb-2 ">
                    {
                        image == null
                        ?   <label
                                className="cursor-pointer flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                <div className="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                        Attach a file
                                    </p>
                                </div>
                                <input type="file" multiple accept="image/*" onChange={ipfsUpload} className="opacity-0 hidden" />
                            </label>
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
            {/* <div className="flex justify-center p-2">
                <button className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl">Create</button>
            </div> */}
        </div>

    );
}

export default ImageUploader;