import {
    Loader
} from "lucide-react"

const Loading = () => {
    return (
        <div className="w-full h-full flex justify-center items-center flex-1">
            <Loader
                className="text-zinc-500 h-8 w-8 animate-spin"
            />
        </div>
    )
}

export default Loading;