import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
  

export const DeleteMessagesDialog = ({
    isOpen,
    setOpen,
    onConfirm,
    disabled
}) => {

    const onOpenChange = (open) => {
        if (!open) {
            setOpen(false);
        }
    }

    return (
        <AlertDialog 
            open = {isOpen}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your messages
                    and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <Button 
                    variant = "ghost"
                    onClick = {() => setOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                    variant = "destructive"
                    onClick = {onConfirm}
                    disabled = {disabled}
                >
                    Delete
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
