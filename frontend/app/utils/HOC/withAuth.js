import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    router.push("/auth/login");
                    return;
                }
            };

            checkAuth();
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
