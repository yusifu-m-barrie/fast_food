import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseSanityOptions<T> {
    fn: () => Promise<T>;
    skip?: boolean;
}

interface UseSanityReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const useSanity = <T>({ fn, skip = false }: UseSanityOptions<T>): UseSanityReturn<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fn();
            setData(result);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "An unknown error occurred";
            setError(errorMessage);
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    }, [fn]);

    useEffect(() => {
        if (!skip) {
            fetchData();
        }
    }, [fetchData, skip]);

    const refetch = async () => await fetchData();

    return { data, loading, error, refetch };
};

export default useSanity;
