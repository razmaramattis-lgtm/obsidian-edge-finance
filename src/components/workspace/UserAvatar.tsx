import { usePresenceContext } from "@/contexts/PresenceContext";

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  profileId?: string;
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[8px]",
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

const onlineDotMap = {
  xs: "w-2 h-2 -bottom-0 -right-0",
  sm: "w-2.5 h-2.5 -bottom-0 -right-0",
  md: "w-3 h-3 -bottom-0.5 -right-0.5",
  lg: "w-3.5 h-3.5 -bottom-0.5 -right-0.5",
  xl: "w-4 h-4 -bottom-0.5 -right-0.5",
};

const colorPalette = [
  "from-rose-500 to-orange-400",
  "from-violet-500 to-purple-400",
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-pink-500 to-rose-400",
  "from-amber-500 to-yellow-400",
  "from-indigo-500 to-blue-400",
  "from-fuchsia-500 to-pink-400",
];

const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

const UserAvatar = ({ name = "?", avatarUrl, size = "sm", online, profileId, className = "" }: UserAvatarProps) => {
  const { isOnline } = usePresenceContext();
  const resolved = online !== undefined ? online : profileId ? isOnline(profileId) : undefined;
  const initial = name.charAt(0).toUpperCase();
  const gradient = getColorFromName(name);

  return (
    <div className={`relative shrink-0 ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-background`}
        />
      ) : (
        <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white ring-2 ring-background`}>
          {initial}
        </div>
      )}
      {resolved !== undefined && (
        <div className={`absolute ${onlineDotMap[size]} rounded-full ring-2 ring-background ${resolved ? "bg-emerald-400" : "bg-red-400"}`} />
      )}
    </div>
  );
};

export default UserAvatar;
