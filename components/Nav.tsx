import { useRouter } from "next/navigation";

interface UserNavProps {
  userInfo: any;
  walletSummary: any;
  affiliateSummary: any;
  onLogout: () => void;
}

const Nav: React.FC<UserNavProps> = ({
  userInfo,
  walletSummary,
  affiliateSummary,
  onLogout,
}) => {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between p-2 m-2">
        <div className="flex items-center justify-between gap-4 w-1/4">
          <h1 className="font-bold text-2xl flex items-center gap-4">
            <img
              src={userInfo.data.avatar_url}
              alt={userInfo.data.username}
              className="w-16 h-16 rounded-full"
            />
            <span className="text-green-500">{userInfo.data.username}</span>
          </h1>
          <button onClick={() => router.push("/")}>Home</button>
        </div>
        <button
          onClick={onLogout}
          className="border-2 border-red-500 w-36 rounded">
          Logout
        </button>
      </div>
      <div className="p-2 m-2 flex justify-between items-center">
        <p>
          Last seen: {userInfo.data.last_seen}{" "}
          <span>
            <sup>{userInfo.data.last_ip_country}</sup>
          </span>
        </p>
        {walletSummary && (
          <div className="flex flex-col gap-2 justify-center p-2">
            <p className="font-bold text-xl">
              {Number(walletSummary.total_market_value).toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}{" "}
              {walletSummary.counter_currency_code}
            </p>
            <ul className="flex gap-4">
              {walletSummary.assets.map((asset: any) => (
                <li key={asset.currency_code}>
                  {asset.currency_code}: {Number(asset.balance).toFixed(2)}
                </li>
              ))}
            </ul>
            {affiliateSummary && (
              <div>
                <p>
                  Affiliate balance:{" "}
                  {Number(
                    affiliateSummary.data.affiliate_balance
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {affiliateSummary.data.fiat_currency_code}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
