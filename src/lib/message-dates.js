import { format } from "date-fns";

export const messageDates = ( timestamp ) => {
    try {

        const currentDate = new Date();
        const messageDate = new Date(timestamp);

        if (
            currentDate.getDate() === messageDate.getDate() &&
            currentDate.getMonth() === messageDate.getMonth() && 
            currentDate.getFullYear() === messageDate.getFullYear()
        ) {
            return "Today";
        }

        else if (
            currentDate.getDate() === messageDate.getDate()-1 &&
            currentDate.getMonth() === messageDate.getMonth() && 
            currentDate.getFullYear() === messageDate.getFullYear()
        ) {
            return "Yesterday";
        }

        else if (
            currentDate.getDate() - messageDate.getDate() <=6 &&
            currentDate.getMonth() === messageDate.getMonth() && 
            currentDate.getFullYear() === messageDate.getFullYear()
        ) {
            return format(timestamp, "eeee");
        }

        else if ( currentDate.getFullYear() === messageDate.getFullYear() ) {
            return format(timestamp, "dd MMMM");
        }

        else {
            return format(timestamp, "dd MMMM yyyy");
        }

        
    } catch (error) {
        return ""
    }
}