import { View, Text, Image, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentUser, logout, updateUserProfile, uploadAvatar } from '@/lib/appwrite';
import { User } from '@/type';

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser as User);
                setName(currentUser.name);
                setEmail(currentUser.email);
            } catch (e) {
                Alert.alert('Error', 'Failed to load user');
            }
        };

        fetchUser();
    }, []);

    const handleSave = async () => {
        try {
            if (!user) return;
            const updated = await updateUserProfile(user.$id, { name, email });
            setUser(updated as User);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated');
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleAvatarPick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            return Alert.alert("Permission required", "You need to allow access to your photos.");
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];

            const file = {
                uri: selectedAsset.uri,
                name: selectedAsset.fileName || "avatar.jpg",
                type: selectedAsset.type || "image/jpeg",
            };

            try {
                const uploaded = await uploadAvatar(file);
                if (user) {
                    const updated = await updateUserProfile(user.$id, { avatar: uploaded.href });
                    setUser(updated as User);
                    Alert.alert("Success", "Avatar updated!");
                }
            } catch (e) {
                Alert.alert("Error", "Failed to upload avatar");
            }
        }
    };

    if (!user) return null;

    return (
        <ScrollView className="flex-1 bg-white px-5 pt-10 pb-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-5">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-bold">Profile</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={22} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View className="items-center -mt-4 mb-5">
                <Image
                    source={{ uri: user.avatar }}
                    className="w-28 h-28 rounded-full"
                    resizeMode="cover"
                />
                <TouchableOpacity
                    className="absolute bottom-2 right-12 bg-white rounded-full p-1"
                    onPress={handleAvatarPick}
                >
                    <MaterialIcons name="edit" size={20} color="#f97316" />
                </TouchableOpacity>
            </View>

            {/* User Info */}
            <View className="bg-lightWhite p-5 rounded-xl space-y-4">
                <ProfileField
                    icon="person"
                    label="Full Name"
                    editable={isEditing}
                    value={name}
                    onChangeText={setName}
                />
                <ProfileField
                    icon="email"
                    label="Email"
                    editable={isEditing}
                    value={email}
                    onChangeText={setEmail}
                />
                <ProfileField icon="phone" label="Phone number" value="+1 555 123 4567" />
                <ProfileField icon="location-on" label="Address 1 - (Home)" value="123 Main Street, Springfield, IL 62704" />
                <ProfileField icon="location-on" label="Address 2 - (Work)" value="221B Rose Street, Foodville, FL 12345" />
            </View>

            {/* Actions */}
            {isEditing ? (
                <TouchableOpacity
                    className="mt-6 bg-green-100 border border-green-500 py-3 rounded-xl items-center"
                    onPress={handleSave}
                >
                    <Text className="text-green-500 font-semibold">Save Changes</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    className="mt-6 bg-orange-100 border border-orange-500 py-3 rounded-xl items-center"
                    onPress={() => setIsEditing(true)}
                >
                    <Text className="text-orange-500 font-semibold">Edit Profile</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                className="mt-4 bg-red-100 border border-red-500 py-3 rounded-xl items-center"
                onPress={async () => {
                    await logout();
                    router.replace("/sign-up");
                }}
            >
                <Text className="text-red-500 font-semibold">Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const ProfileField = ({
                          icon,
                          label,
                          value,
                          editable = false,
                          onChangeText,
                      }: {
    icon: any;
    label: string;
    value: string;
    editable?: boolean;
    onChangeText?: (text: string) => void;
}) => {
    return (
        <View className="flex-row items-center space-x-3">
            <MaterialIcons name={icon} size={20} color="#f97316" />
            <View className="flex-1">
                <Text className="text-xs text-gray-400">{label}</Text>
                {editable && onChangeText ? (
                    <TextInput
                        className="text-base font-semibold"
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={label}
                    />
                ) : (
                    <Text className="text-base font-semibold">{value}</Text>
                )}
            </View>
        </View>
    );
};

export default Profile;
