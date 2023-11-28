import Image from "next/image";

export const ImageTypeMessage = ({
    data
}) => {
    return (
        <div className="flex flex-col justify-center items-center gap-y-3">
            <div className="w-64 h-64 mt-2 rounded-md overflow-hidden relative">
                <Image
                    fill
                    className="object-cover"
                    alt="image"
                    src={data.url} 
                />
            </div>
            {
                data.message !== "" && <p className="text-left w-full">
                                            {data.message}
                                        </p>
            }
        </div>
    );
}
