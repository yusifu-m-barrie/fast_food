import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import cn from "clsx";

import useSanity from "@/lib/useSanity";
import {
    fetchCategories,
    fetchMenuItems,
} from "@/lib/sanityQueries";

import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import { MenuItem } from "@/type";

const Search = () => {
    const { category = "", query = "" } = useLocalSearchParams<{
        query?: string;
        category?: string;
    }>();

    // Fetch categories from Sanity
    const { data: categories, loading: loadingCategories } = useSanity({
        fn: fetchCategories,
    });

    // Memoized fetch for menu items with filters
    const fetchMenuWithParams = useCallback(() => {
        return fetchMenuItems({ category, query });
    }, [category, query]);

    const {
        data: menuItems = [],
        loading: loadingMenu,
        refetch,
    } = useSanity({
        fn: fetchMenuWithParams,
    });

    // Refetch when category or query changes
    useEffect(() => {
        refetch();
    }, [category, query]);

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={menuItems}
                renderItem={({ item, index }) => {
                    const isFirstRightColItem = index % 2 === 0;

                    return (
                        <View
                            key={item?._id || index}
                            className={cn(
                                "flex-1 max-w-[48%]",
                                !isFirstRightColItem ? "mt-10" : "mt-0"
                            )}
                        >
                            <MenuCard item={item as MenuItem} />
                        </View>
                    );
                }}
                keyExtractor={(item, index) => item?._id || index.toString()}
                numColumns={2}
                columnWrapperClassName="gap-7"
                contentContainerClassName="gap-7 px-5 pb-32"
                ListHeaderComponent={() => (
                    <View className="my-5 gap-5">
                        <View className="flex-between flex-row w-full">
                            <View className="flex-start">
                                <Text className="small-bold uppercase text-primary">
                                    Search
                                </Text>
                                <View className="flex-start flex-row gap-x-1 mt-0.5">
                                    <Text className="paragraph-semibold text-dark-100">
                                        Find your favorite food
                                    </Text>
                                </View>
                            </View>
                            <CartButton />
                        </View>
                        <SearchBar />
                        <Filter categories={categories || []} />
                    </View>
                )}
                ListEmptyComponent={() =>
                    !loadingMenu && (
                        <Text className="text-center text-gray-400 mt-10">
                            No Menu items found, try adjusting filters
                        </Text>
                    )
                }
            />
        </SafeAreaView>
    );
};

export default Search;
