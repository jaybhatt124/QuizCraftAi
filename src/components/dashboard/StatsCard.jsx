import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-500"
  },
  green: {
    bg: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-500"
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-500"
  },
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-600",
    icon: "text-amber-500"
  }
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-24 h-24 ${colors.bg} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 ${colors.light} rounded-xl`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}