import React from 'react'

const ImagesUplaod = ({ getRootProps, isDragActive, getInputProps, uploadError, previewImages, removeImage, }) => {
    return (
        <div className='w-full' >
            <h2 className="text-xl font-semibold mb-4 underline">Images (Max 10)</h2>

            {/* Dropzone Area */}
            <div {...getRootProps()} className={`border-2 text-sm border-dashed rounded-lg p-6 text-center cursor-pointer 
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the images here...</p>
                ) : (
                    <p>Drag & drop some images here, or click to select files</p>
                )}
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 10 images)</p>
            </div>

            {/* Upload Error */}
            {uploadError && (
                <div className="mt-2 text-red-500 text-sm">{uploadError}</div>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">
                        Selected Images ({previewImages.length}/10)
                        {previewImages.some(img => img.status === 'uploading') && (
                            <span className="ml-2 text-sm text-gray-500">(Uploading...)</span>
                        )}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index}`}
                                    className={`w-full h-60 object-cover rounded border ${image.status === 'error' ? 'opacity-50' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={image.status === 'uploading'}
                                >
                                    ×
                                </button>

                                {/* Status indicators */}
                                {image.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                                {image.status === 'error' && (
                                    <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center text-white text-xs">
                                        Upload Failed
                                    </div>
                                )}
                                {image.status === 'completed' && (
                                    <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                        Uploaded
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImagesUplaod
