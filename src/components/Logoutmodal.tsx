import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
 const LogoutModal=({isOpen, toggleModal, onLogoutSuccess})=> {
  if (!isOpen) return null;
  const handleTokenRemoval=()=>{
    Cookies.remove("token")
    toggleModal()
    onLogoutSuccess();
  }
  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm"
        onClick={() => toggleModal(false)}
      >
        <div
          className="w-1/4 bg-white rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Card>
            <CardHeader>
              <CardTitle>Are you sure you want to logout?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex w-full gap-4 justify-center">
                <Button className="bg-black text-white" onClick={()=>toggleModal(false)}>Cancel</Button>
                <Button className="bg-white transition ease-in-out duration-300 hover:bg-primary/90 text-black"
                  onClick={handleTokenRemoval}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )

}

export default LogoutModal