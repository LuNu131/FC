/*
  # Row Level Security (RLS) Policies
  
  ## Overview
  Implements comprehensive security policies for all tables to ensure data protection and proper access control.
  
  ## Security Model
  
  ### Authentication Levels
  1. **Public Access**: None (all tables require authentication)
  2. **Authenticated Users**: Can read their own data
  3. **Admin Users**: Full CRUD access to all data
  4. **Player Users**: Limited access based on ownership
  
  ## RLS Policies by Table
  
  ### 1. players
  - SELECT: All authenticated users can view all players
  - INSERT: Admin only
  - UPDATE: Admin only
  - DELETE: Admin only
  
  ### 2. users
  - SELECT: Users can view their own record, admins can view all
  - INSERT: Not allowed (handled by auth system)
  - UPDATE: Users can update their own display_name, admins can update all
  - DELETE: Admin only
  
  ### 3. sessions
  - SELECT: All authenticated users can view all sessions
  - INSERT: Admin only
  - UPDATE: Admin only
  - DELETE: Admin only
  
  ### 4. attendance
  - SELECT: All authenticated users can view all attendance records
  - INSERT: Users can check themselves in, admins can add anyone
  - UPDATE: Not allowed (delete and recreate instead)
  - DELETE: Admin only
  
  ### 5. attendance_attempts
  - SELECT: Users can view their own attempts, admins can view all
  - INSERT: System managed (users can create for themselves)
  - UPDATE: System managed (users can update their own)
  - DELETE: Admin only
  
  ### 6. teams
  - SELECT: All authenticated users can view all teams
  - INSERT: Admin only
  - UPDATE: Admin only
  - DELETE: Admin only
  
  ### 7. team_members
  - SELECT: All authenticated users can view all team assignments
  - INSERT: Admin only
  - UPDATE: Not applicable (delete and recreate)
  - DELETE: Admin only
  
  ### 8. funds
  - SELECT: All authenticated users can view all fund transactions
  - INSERT: Admin only
  - UPDATE: Admin only
  - DELETE: Admin only
  
  ### 9. custom_traits
  - SELECT: All authenticated users can view all traits
  - INSERT: Admin only
  - UPDATE: Admin only
  - DELETE: Admin only
  
  ## Helper Functions
  - `is_admin()`: Checks if current user has admin role
  - `current_user_player_id()`: Gets player_id of current user
  
  ## Important Notes
  - All policies restrict to authenticated users minimum
  - Admin role bypasses most restrictions
  - No anonymous access allowed
  - DELETE operations are admin-only for data integrity
  - UPDATE policies include USING and WITH CHECK for security
*/

-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_traits ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get current user's player_id
CREATE OR REPLACE FUNCTION current_user_player_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT player_id FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PLAYERS TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all players"
  ON players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert players"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update players"
  ON players FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete players"
  ON players FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own profile, admins view all"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own display name, admins update all"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin())
  WITH CHECK (
    (auth.uid() = id AND display_name IS NOT NULL) OR is_admin()
  );

CREATE POLICY "Admin can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- SESSIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- ATTENDANCE TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can check in themselves, admins can add anyone"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    player_id = current_user_player_id() OR is_admin()
  );

CREATE POLICY "Admin can delete attendance"
  ON attendance FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- ATTENDANCE_ATTEMPTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users view own attempts, admins view all"
  ON attendance_attempts FOR SELECT
  TO authenticated
  USING (
    player_id = current_user_player_id() OR is_admin()
  );

CREATE POLICY "Users can create own attempts, admins create all"
  ON attendance_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    player_id = current_user_player_id() OR is_admin()
  );

CREATE POLICY "Users can update own attempts, admins update all"
  ON attendance_attempts FOR UPDATE
  TO authenticated
  USING (
    player_id = current_user_player_id() OR is_admin()
  )
  WITH CHECK (
    player_id = current_user_player_id() OR is_admin()
  );

CREATE POLICY "Admin can delete attendance attempts"
  ON attendance_attempts FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- TEAMS TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- TEAM_MEMBERS TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all team members"
  ON team_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- FUNDS TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all funds"
  ON funds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert funds"
  ON funds FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update funds"
  ON funds FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete funds"
  ON funds FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================
-- CUSTOM_TRAITS TABLE POLICIES
-- ============================================

CREATE POLICY "Authenticated users can view all traits"
  ON custom_traits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert traits"
  ON custom_traits FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update traits"
  ON custom_traits FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete traits"
  ON custom_traits FOR DELETE
  TO authenticated
  USING (is_admin());
