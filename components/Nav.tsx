import { useRouter } from "next/navigation";
interface UserNavProps {
  userInfo: any;
  onLogout: () => void;
}

const Nav: React.FC<UserNavProps> = ({ userInfo, onLogout }) => {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between p-2 m-2">
        <div className="flex items-center justify-between gap-4 w-1/4 ">
          <h1 className="font-bold text-2xl flex items-center gap-4">
            <img
              src={userInfo.data.avatar_url}
              alt={userInfo.data.username}
              className="w-16 h-16 rounded-full"
            />
            <span className="text-green-500 ">{userInfo.data.username}</span>
          </h1>
          <button onClick={() => router.push("/")}>Home</button>
        </div>
        <button
          onClick={onLogout}
          className="border-2 border-red-500 w-36 rounded">
          Logout
        </button>
      </div>
      <div className="p-2 m-2 flex justify-between">
        <p>
          Last seen: {userInfo.data.last_seen}{" "}
          <span>
            <sup>{userInfo.data.last_ip_country}</sup>
          </span>
        </p>
        <ul className="flex gap-4">
          <li>BTC: {userInfo.data.total_btc}</li>
          <li>ETH: {userInfo.data.total_eth}</li>
          <li>USDT: {userInfo.data.total_usdt}</li>
          <li>USDC: {userInfo.data.total_usdc}</li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
