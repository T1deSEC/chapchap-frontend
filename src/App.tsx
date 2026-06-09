import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import HomePage from './pages/home/HomePage'
import DiaryWritePage from './pages/home/DiaryWritePage'
import DiaryDetailPage from './pages/home/DiaryDetailPage'
import RecommendPage from './pages/home/RecommendPage'
import NotificationPage from './pages/home/NotificationPage'
import SettingsPage from './pages/home/SettingsPage'
import NotificationSettingsPage from './pages/home/NotificationSettingsPage'
import ChangeNicknamePage from './pages/home/ChangeNicknamePage'
import ChangePasswordPage from './pages/home/ChangePasswordPage'
import IngredientPage from './pages/ingredient/IngredientPage'
import AiAnalysisLoadingPage from './pages/ingredient/AiAnalysisLoadingPage'
import ProductDetailPage from './pages/ingredient/ProductDetailPage'
import ProductFeedbackPage from './pages/ingredient/ProductFeedbackPage'
import RoutinePage from './pages/routine/RoutinePage'
import AiRoutineLoadingPage from './pages/routine/AiRoutineLoadingPage'
import AiRoutineResultPage from './pages/routine/AiRoutineResultPage'
import ProfilePage from './pages/profile/ProfilePage'
import SkinProfileSetupPage from './pages/profile/SkinProfileSetupPage'
import WishlistPage from './pages/profile/WishlistPage'
import FeedbackHistoryPage from './pages/profile/FeedbackHistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 보호 라우트 — AppLayout이 AuthGuard 역할 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/diary/write" element={<DiaryWritePage />} />
          <Route path="/home/diary/:id" element={<DiaryDetailPage />} />
          <Route path="/home/recommend" element={<RecommendPage />} />
          <Route path="/home/notifications" element={<NotificationPage />} />
          <Route path="/home/settings" element={<SettingsPage />} />
          <Route path="/home/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/home/settings/change-nickname" element={<ChangeNicknamePage />} />
          <Route path="/home/settings/change-password" element={<ChangePasswordPage />} />

          {/* /ingredient/ai-loading을 /:productId보다 먼저 — static segment 우선 */}
          <Route path="/ingredient" element={<IngredientPage />} />
          <Route path="/ingredient/ai-loading" element={<AiAnalysisLoadingPage />} />
          <Route path="/ingredient/:productId" element={<ProductDetailPage />} />
          <Route path="/ingredient/:productId/feedback" element={<ProductFeedbackPage />} />

          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/routine/ai-loading" element={<AiRoutineLoadingPage />} />
          <Route path="/routine/ai-result" element={<AiRoutineResultPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/skin-setup" element={<SkinProfileSetupPage />} />
          <Route path="/profile/wishlist" element={<WishlistPage />} />
          <Route path="/profile/feedback-history" element={<FeedbackHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
