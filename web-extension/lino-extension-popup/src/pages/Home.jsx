import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="p-6 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to LiNo</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
                Lino helps you seamlessly capture, organize, and manage your online lectures notes.
                Get started by logging in or creating a new account.
            </p>

            <div className="flex gap-4">
                <Link to="/login">
                    <Button variant="default" className="px-6">
                        Login
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button variant="outline" className="px-6">
                        Sign Up
                    </Button>
                </Link>
            </div>

            <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Made with ❤️ by Team Lino
            </footer>
        </div>
    );
}
