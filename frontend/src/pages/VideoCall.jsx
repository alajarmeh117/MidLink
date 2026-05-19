import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { roomId } = useParams();

  // دالة لجلب بيانات المستخدم وتحديد الاسم الصحيح
  const getUsername = () => {
    const userData = JSON.parse(localStorage.getItem("user")); // تأكد من اسم المفتاح في localStorage
    if (!userData) return "User_" + Math.floor(Math.random() * 100);

    // إذا كان دكتور رح يكون عنده staff_name، وإذا مريض رح يكون username
    return userData.staff_name || userData.username || "Member";
  };

  const myMeeting = async (element) => {
    const appID = 1256080034;
    const serverSecret = "68112d27eb7cf9a7678b3fa59f9db274";
    const userName = getUsername();
    const userId = Math.floor(Math.random() * 10000).toString(); // معرف عشوائي للجلسة

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      userName,
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      // تأكيد تفعيل الشات
      showUserList: true,
      showTextChat: true,
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div ref={myMeeting} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default VideoCall;
