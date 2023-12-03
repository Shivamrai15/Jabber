
import Image from "next/image";

export const EmptyMessage = () => {

    return (
        <div className="max-w-sm w-72 relative bg-black bg-opacity-40 flex flex-col justify-center items-center rounded-xl py-4 px-2 cursor-default">
            <p>
                💀 Chat's dead, hit me up. 💯
            </p>
            <div className="relative h-64 w-64">
                <Image
                    className="object-fill"
                    fill
                    alt="image"
                    src="/images/hello-world.png"
                />
            </div> 
        </div>
    );
}