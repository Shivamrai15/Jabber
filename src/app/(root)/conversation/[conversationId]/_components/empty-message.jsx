"use client";
import Image from "next/image"

export const EmptyMessage = () => {

    const images = [
        "/images/ghost.png",
        "/images/hello (1).png",
        "/images/hello (2).png",
        "/images/hello-world.png",
        "/images/hello.png",
        "/images/hi.png",
        "/images/panda.png",
    ];

    const randomImage = Math.floor(Math.random()*7);

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
                    src={images[randomImage]}
                />
            </div> 
        </div>
    );
}
