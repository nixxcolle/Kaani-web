import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Users, 
  Star, 
  Crown, 
  Medal, 
  Sparkles, 
  Search, 
  ArrowRight,
  Flame,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { getLocalLeaderboard, LeaderboardRecord } from "@/lib/data";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    // Read current user
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUserName(parsed.name || parsed.email || null);
      }
    } catch {
      setCurrentUserName(null);
    }

    const fetchLeaderboard = async () => {
      // First get local verified leaderboard
      const localData = getLocalLeaderboard();
      
      try {
        const { data: scoresData, error: scoresError } = await supabase
          .from("quiz_scores")
          .select("user_id, user_name, score")
          .order("created_at", { ascending: false });

        if (!scoresError && scoresData && scoresData.length > 0) {
          const userScoresMap = new Map<string, { total_xp: number; best_score: number; quiz_count: number; user_name: string }>();
          
          scoresData.forEach((score: any) => {
            const userId = score.user_id;
            const scoreValue = parseFloat(score.score.toString());
            
            if (!userScoresMap.has(userId)) {
              userScoresMap.set(userId, {
                total_xp: 0,
                best_score: 0,
                quiz_count: 0,
                user_name: score.user_name || "Unknown User",
              });
            }
            
            const userData = userScoresMap.get(userId)!;
            userData.total_xp += scoreValue;
            userData.best_score = Math.max(userData.best_score, scoreValue);
            userData.quiz_count += 1;
          });

          const remoteList: LeaderboardRecord[] = Array.from(userScoresMap.entries()).map(([user_id, data]) => ({
            user_id,
            user_name: data.user_name,
            total_xp: data.total_xp,
            best_score: data.best_score,
            quiz_count: data.quiz_count,
            badge: data.best_score >= 90 ? "Master Harvester" : "Agri Champion"
          }));

          // Merge with local records
          const combined = [...remoteList];
          localData.forEach(loc => {
            if (!combined.some(c => c.user_name.toLowerCase() === loc.user_name.toLowerCase())) {
              combined.push(loc);
            }
          });

          combined.sort((a, b) => b.total_xp - a.total_xp);
          setLeaderboard(combined.map((item, idx) => ({ ...item, rank: idx + 1 })));
        } else {
          setLeaderboard(localData);
        }
      } catch (err) {
        console.warn("Using offline leaderboard:", err);
        setLeaderboard(localData);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboard;
    return leaderboard.filter(e => 
      e.user_name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [leaderboard, searchQuery]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = filteredLeaderboard.slice(topThree.length);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-section">
        <Header />

        <main className="container px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Header Card */}
            <div className="rounded-3xl bg-white shadow-elevated border border-emerald-100 p-6 md:p-10 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs md:text-sm font-bold mb-3">
                    <Trophy className="h-4 w-4 text-amber-600 fill-amber-500" />
                    <span>Global Hall of Fame</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-kaani-dark tracking-tight">
                    Community Leaderboard
                  </h1>
                  <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl leading-relaxed">
                    Compete with fellow students, farmers, and fisherfolk. Complete interactive quizzes to earn XP, maintain streaks, and climb the ranks!
                  </p>
                </div>

                {/* Quick Action & Stats Pill */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3">
                    <Users className="h-6 w-6 text-kaani-primary" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                        Active Learners
                      </p>
                      <p className="text-2xl font-black font-heading text-kaani-dark">
                        {loading ? "…" : leaderboard.length}
                      </p>
                    </div>
                  </div>

                  <Button 
                    className="bg-kaani-primary hover:bg-kaani-dark text-white rounded-2xl py-6 px-6 shadow-md font-bold"
                    asChild
                  >
                    <Link to="/quiz" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-200" />
                      Take Quiz & Earn XP
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* TOP 3 PODIUM */}
            {!loading && topThree.length >= 3 && !searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                
                {/* 2nd Place */}
                <Card className="rounded-3xl border-slate-200 bg-white/95 shadow-md order-2 md:order-1 flex flex-col justify-between text-center p-6 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-extrabold text-sm flex items-center justify-center border-2 border-white shadow-sm">
                    2
                  </div>
                  <div className="pt-2">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow-inner">
                      {topThree[1].user_name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{topThree[1].user_name}</h3>
                    <Badge variant="outline" className="mt-1 text-xs border-slate-200 bg-slate-50 text-slate-700">
                      {topThree[1].badge || "Agri Champion"}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">XP</span>
                      <p className="text-lg font-black text-slate-800">{Math.round(topThree[1].total_xp)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Best</span>
                      <p className="text-lg font-black text-slate-800">{Math.round(topThree[1].best_score)}%</p>
                    </div>
                  </div>
                </Card>

                {/* 1st Place (Champion) */}
                <Card className="rounded-3xl border-amber-300 bg-gradient-to-b from-amber-50/80 to-white shadow-elevated order-1 md:order-2 flex flex-col justify-between text-center p-6 relative ring-2 ring-amber-200 md:-translate-y-3">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-extrabold text-base flex items-center justify-center border-2 border-white shadow-md">
                    <Crown className="h-5 w-5 fill-amber-100" />
                  </div>
                  <div className="pt-4">
                    <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center font-black text-2xl mb-3 shadow-inner ring-4 ring-amber-200/60">
                      {topThree[0].user_name.charAt(0)}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg line-clamp-1">{topThree[0].user_name}</h3>
                    <Badge className="mt-1 text-xs bg-amber-500 hover:bg-amber-600 text-white shadow-xs">
                      {topThree[0].badge || "Master Harvester"}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-around">
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold">Total XP</span>
                      <p className="text-2xl font-black text-amber-900">{Math.round(topThree[0].total_xp)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold">Best Score</span>
                      <p className="text-2xl font-black text-amber-900">{Math.round(topThree[0].best_score)}%</p>
                    </div>
                  </div>
                </Card>

                {/* 3rd Place */}
                <Card className="rounded-3xl border-amber-200 bg-white/95 shadow-md order-3 flex flex-col justify-between text-center p-6 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center border-2 border-white shadow-sm">
                    3
                  </div>
                  <div className="pt-2">
                    <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-900 mx-auto flex items-center justify-center font-bold text-xl mb-3 shadow-inner">
                      {topThree[2].user_name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{topThree[2].user_name}</h3>
                    <Badge variant="outline" className="mt-1 text-xs border-amber-200 bg-amber-50/70 text-amber-800">
                      {topThree[2].badge || "Eco-Innovator"}
                    </Badge>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">XP</span>
                      <p className="text-lg font-black text-slate-800">{Math.round(topThree[2].total_xp)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Best</span>
                      <p className="text-lg font-black text-slate-800">{Math.round(topThree[2].best_score)}%</p>
                    </div>
                  </div>
                </Card>

              </div>
            )}

            {/* Search and Table Section */}
            <div className="rounded-3xl bg-white shadow-md border border-slate-100 p-6 md:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-lg font-bold font-heading text-slate-900">
                  Full Rankings ({filteredLeaderboard.length})
                </h2>
                
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search learner name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl border-slate-200 bg-slate-50/60"
                  />
                </div>
              </div>

              {/* Leaderboard Rows */}
              <div className="space-y-3">
                {filteredLeaderboard.map((entry, index) => {
                  const isCurrent = currentUserName && entry.user_name.toLowerCase() === currentUserName.toLowerCase();
                  const rankNumber = entry.rank || index + 1;

                  return (
                    <div
                      key={entry.user_id + "-" + index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                        isCurrent 
                          ? "bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-200 shadow-sm"
                          : rankNumber === 1
                          ? "bg-amber-50/40 border-amber-200"
                          : "bg-white hover:bg-slate-50/80 border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                            rankNumber === 1
                              ? "bg-amber-400 text-white shadow-xs"
                              : rankNumber === 2
                              ? "bg-slate-300 text-slate-800"
                              : rankNumber === 3
                              ? "bg-amber-700 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rankNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">{entry.user_name}</span>
                            {isCurrent && (
                              <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5">You</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{entry.quiz_count} quiz{entry.quiz_count !== 1 ? 'zes' : ''} completed</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{entry.badge || "Agri Learner"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</span>
                          <p className="text-sm font-bold text-slate-700">{Math.round(entry.best_score)}%</p>
                        </div>

                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-1.5">
                          <Star className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block -mb-1">XP</span>
                            <span className="text-base font-black text-emerald-900">{Math.round(entry.total_xp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredLeaderboard.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No learners found matching "{searchQuery}".</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Leaderboard;
