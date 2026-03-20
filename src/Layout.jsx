
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Plus, BarChart3, Trophy, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Create Quiz",
    url: createPageUrl("CreateQuiz"),
    icon: Plus,
  },
  {
    title: "My Results", 
    url: createPageUrl("Results"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 250 84% 60%;
            --primary-foreground: 0 0% 98%;
            --secondary: 260 80% 65%;
            --accent: 220 90% 96%;
            --muted: 240 4.8% 95.9%;
          }
          
          .quiz-gradient {
            background: linear-gradient(135deg, hsl(250, 84%, 60%) 0%, hsl(260, 80%, 65%) 100%);
          }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Sidebar className="border-r border-white/20 bg-white/90 backdrop-blur-md">
          <SidebarHeader className="border-b border-white/20 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 quiz-gradient rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">QuizCraft</h2>
                <p className="text-sm text-gray-500">Smart Quiz Generator</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-2 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm' 
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-600">Quizzes Created</span>
                    <span className="ml-auto font-bold text-amber-600">0</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Average Score</span>
                    <span className="ml-auto font-bold text-blue-600">-%</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold">QuizCraft</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
