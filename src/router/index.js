import Auth from "../auth";
import Login from "../pages/Login";
import NewsSandBox from "../pages/NewsSandBox";
import Home from "../pages/NewsSandBox/Home";
import UserList from "../pages/NewsSandBox/UserList";
import RoleList from "../pages/NewsSandBox/RoleList";
import RightList from "../pages/NewsSandBox/RightList";
import NewsAdd from "../pages/NewsSandBox/news-manage/NewsAdd"
import NewsDraft from "../pages/NewsSandBox/news-manage/NewsDraft"
import NewsCategory from "../pages/NewsSandBox/news-manage/NewsCategory"
import Audit from "../pages/NewsSandBox/audit-manage/Audit"
import AuditList from "../pages/NewsSandBox/audit-manage/AuditList"
import Unpublished from "../pages/NewsSandBox/publish-manage/Unpublished"
import Published from "../pages/NewsSandBox/publish-manage/Published"
import Sunset from "../pages/NewsSandBox/publish-manage/Sunset"
import { Navigate } from "react-router-dom";
import NewsPreview from "../pages/NewsSandBox/news-manage/NewsPreview";
import NewsUpdate from "../pages/NewsSandBox/news-manage/NewsUpdate";
import News from "../pages/News";
import Detail from "../pages/Detail";
const list = [
    {
        path:"/news",
        element:<News/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/detail/:id",
        element:<Detail/>
    },
    {
        path:"/",
        element:<Auth><NewsSandBox/></Auth>,
        children:[
            {
                path:"home",
                element:<Home/>
            },
            {
                path:"user-manage/list",
                element:<UserList/>
            },
            {
                path:"right-manage/role/list",
                element:<RoleList/>
            },
            {
                path:"right-manage/right/list",
                element:<RightList/>
            },
            {
                path:"news-manage/add",
                element:<NewsAdd/>
            },
            {
                path:"news-manage/draft",
                element:<NewsDraft/>
            },
            {
                path:"news-manage/category",
                element:<NewsCategory/>
            },
            {
                path:"news-manage/preview/:id",
                element:<NewsPreview/>
            },
            {
                path:"news-manage/update/:id",
                element:<NewsUpdate/>
            },
            {
                path:"audit-manage/audit",
                element:<Audit/>
            },
            {
                path:"audit-manage/list",
                element:<AuditList/>
            },
            {
                path:"publish-manage/unpublished",
                element:<Unpublished/>
            },
            {
                path:"publish-manage/sunset",
                element:<Sunset/>
            },
            {
                path:"publish-manage/published",
                element:<Published/>
            },
            {
                path:"/",
                element:<Navigate to="/home"/>
            },
            {
                path:"*",
                element:<div>404 NotFound</div>
            }
        ]
    },

]
export default list;
