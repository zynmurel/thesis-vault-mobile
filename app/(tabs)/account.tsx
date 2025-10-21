import { baseUrl } from "@/constants/consts";
import { useUserStore } from "@/hooks/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { LockOpen, LogOut, Pencil, User } from "lucide-react-native"; // if you want an icon
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import {
  ActivityIndicator,
  Button,
  Menu,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { Toast } from "toastify-react-native";

const courses = [
  {
    label: "Bachelor of Science in Computer Science",
    value: "BSCS",
  },
  {
    label: "Bachelor of Science in Information System",
    value: "BSIT",
  },
  {
    label: "Bachelor of Science in Information System",
    value: "BSIS",
  },
  {
    label: "Bachelor of Science in Entertainment and Media Computing",
    value: "BSEMC",
  },
];
const years = ["1", "2", "3", "4"];
const sections = ["A", "B", "C", "D", "E"];
const genders = ["MALE", "FEMALE"];

export default function TabTwoScreen() {
  const { userId, user, setUser } = useUserStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const handleChangePassword = async () => {
    setChangePasswordLoading(true);
    if (!user?.password) throw new Error("No data found");
    if (!(newPassword.length < 8)) {
      if (newPassword !== confirmPassword) {
        Toast.error("Passwords do not match");
        setChangePasswordLoading(false);
        return;
      } else {
        try {
          const res = await axios.post(baseUrl + "/api/mobile/student/update", {
            studentId: userId,
            password: newPassword,
            currentPassword : currentPassword
          });
          if (res.data.status === 401) {
            if (res.data.message === "user_not_found") {
              Toast.error("User not found.");
            } else {
              Toast.error("Wrong password.");
            }
          } else {
            setUser(res.data.student);
            setPasswordVisible(false);
            Toast.success("Password changed successfully");
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPassword("");
            return res.data;
          }
        } catch (err) {
          console.log(err);
          Toast.error("Server error");
        } finally {
          setChangePasswordLoading(false);
        }
      }
    } else {
      Toast.error("Password must be atleast 8 characters");
      setChangePasswordLoading(false);
      return;
    }

    console.log("Change password with:", { currentPassword, newPassword });
    setChangePasswordLoading(false);
  };

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [editData, setEditData] = useState<typeof user>(user);
  const [menuVisible, setMenuVisible] = useState({
    course: false,
    year: false,
    section: false,
    gender: false,
  });

  const getUserDetails = async () => {
    try {
      setLoading(true); // show loader
      const res = await axios.post(baseUrl + "/api/mobile/student/get", {
        studentId: userId,
      });
      setUser(res.data.student);
      return res.data;
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false); // hide loader
    }
  };

  const saveChanges = async () => {
    try {
      setPending(true); // show loader
      if (!editData) throw new Error("No data found");
      const { id, studentId, password, createdAt, updatedAt, ...rest } =
        editData;
      const res = await axios.post(baseUrl + "/api/mobile/student/update", {
        studentId: userId,
        ...rest,
      });
      setUser(res.data.student);
      return res.data;
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setPending(false); // hide loader
      closeModal();
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_id");
    router.replace("/login");
  };
  const closeModal = () => setVisible(false);

  const openModal = () => {
    if (user) {
      setEditData(user);
      setVisible(true);
    }
  };

  // Run once when component mounts
  useEffect(() => {
    getUserDetails();
  }, []);

  const renderRow = (label: string, value?: string | number) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#f5e05d" />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : user ? (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.iconWrapper}>
              <User size={30} color="#000" />
            </View>
            <Text style={styles.header}>Student Account</Text>
          </View>

          {user && renderRow("Student ID", user?.studentId)}
          {user &&
            renderRow(
              "Name",
              `${user?.lastName}, ${user?.firstName} ${user?.middleName}`
            )}
          {user && renderRow("Course", user?.courseCode)}
          {user && renderRow("Section", user?.section)}
          {user && renderRow("Year", String(user?.year))}
          {user && renderRow("Gender", user?.gender)}
          {user && renderRow("Email", user?.email)}
          {user && renderRow("Contact No", user?.contactNo)}

          <TouchableOpacity style={styles.editButton} onPress={openModal}>
            <Pencil size={13} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.passButton}
            onPress={() => setPasswordVisible(true)}
          >
            <LockOpen size={13} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.passText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={13} color="white" style={{ marginRight: 6 }} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Edit Modal */}
          <Portal>
            <Modal
              visible={visible}
              onDismiss={closeModal}
              contentContainerStyle={styles.modal}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <Text style={styles.modalTitle}>Edit Student Details</Text>
                <TextInput
                  label="First Name"
                  value={editData?.firstName || ""}
                  onChangeText={(t) =>
                    setEditData({ ...editData!, firstName: t })
                  }
                  style={styles.input}
                />
                <TextInput
                  label="Middle Name"
                  value={editData?.middleName || ""}
                  onChangeText={(t) =>
                    setEditData({ ...editData!, middleName: t })
                  }
                  style={styles.input}
                />
                <TextInput
                  label="Last Name"
                  value={editData?.lastName || ""}
                  onChangeText={(t) =>
                    setEditData({ ...editData!, lastName: t })
                  }
                  style={styles.input}
                />

                {/* Gender Dropdown */}
                <Menu
                  visible={menuVisible.gender}
                  onDismiss={() =>
                    setMenuVisible({ ...menuVisible, gender: false })
                  }
                  anchor={
                    <TextInput
                      label="Gender"
                      mode="outlined"
                      value={editData?.gender}
                      style={styles.input}
                      onFocus={() =>
                        setMenuVisible({ ...menuVisible, gender: true })
                      }
                    />
                  }
                >
                  {genders.map((g) => (
                    <Menu.Item
                      key={g}
                      onPress={() => {
                        setEditData({
                          ...editData!,
                          gender: g as "MALE" | "FEMALE",
                        });
                        setMenuVisible({ ...menuVisible, gender: false });
                      }}
                      title={g}
                    />
                  ))}
                </Menu>
                <TextInput
                  label="Email"
                  value={editData?.email || ""}
                  onChangeText={(t) => setEditData({ ...editData!, email: t })}
                  style={styles.input}
                />
                <TextInput
                  label="Contact No"
                  value={editData?.contactNo || ""}
                  onChangeText={(t) =>
                    setEditData({ ...editData!, contactNo: t })
                  }
                  style={styles.input}
                />

                {/* Course Dropdown */}
                <Menu
                  visible={menuVisible.course}
                  onDismiss={() =>
                    setMenuVisible({ ...menuVisible, course: false })
                  }
                  anchor={
                    <TextInput
                      label="Course"
                      mode="outlined"
                      value={editData?.courseCode}
                      style={styles.input}
                      onFocus={() =>
                        setMenuVisible({ ...menuVisible, course: true })
                      }
                    />
                  }
                >
                  {courses.map((c) => (
                    <Menu.Item
                      key={c.value}
                      onPress={() => {
                        setEditData({ ...editData!, courseCode: c.value });
                        setMenuVisible({ ...menuVisible, course: false });
                      }}
                      title={`${c.value} - ${c.label}`}
                      titleStyle={{ fontSize: 13 }}
                    />
                  ))}
                </Menu>

                {/* Year Dropdown */}
                <Menu
                  visible={menuVisible.year}
                  onDismiss={() =>
                    setMenuVisible({ ...menuVisible, year: false })
                  }
                  anchor={
                    <TextInput
                      label="Year"
                      mode="outlined"
                      value={String(editData?.year)}
                      style={styles.input}
                      onFocus={() =>
                        setMenuVisible({ ...menuVisible, year: true })
                      }
                    />
                  }
                >
                  {years.map((y) => (
                    <Menu.Item
                      key={y}
                      onPress={() => {
                        setEditData({
                          ...editData!,
                          year: Number(y) as 1 | 2 | 3 | 4,
                        });
                        setMenuVisible({ ...menuVisible, year: false });
                      }}
                      title={y}
                    />
                  ))}
                </Menu>

                {/* Section Dropdown */}
                <Menu
                  visible={menuVisible.section}
                  onDismiss={() =>
                    setMenuVisible({ ...menuVisible, section: false })
                  }
                  anchor={
                    <TextInput
                      label="Section"
                      mode="outlined"
                      value={editData?.section}
                      style={styles.input}
                      onFocus={() =>
                        setMenuVisible({ ...menuVisible, section: true })
                      }
                    />
                  }
                >
                  {sections.map((s) => (
                    <Menu.Item
                      key={s}
                      onPress={() => {
                        setEditData({ ...editData!, section: s });
                        setMenuVisible({ ...menuVisible, section: false });
                      }}
                      title={s}
                    />
                  ))}
                </Menu>

                {/* Save / Cancel Buttons */}
                <View style={styles.buttonRow}>
                  <Button onPress={closeModal}>Cancel</Button>
                  <Button
                    mode="contained"
                    onPress={saveChanges}
                    disabled={pending}
                  >
                    Save
                  </Button>
                </View>
              </ScrollView>
            </Modal>
          </Portal>
          <Portal>
            <Modal
              visible={passwordVisible}
              onDismiss={() => setPasswordVisible(false)}
              contentContainerStyle={styles.modal}
            >
              <Text style={styles.modalTitle}>Change Password</Text>

              <TextInput
                label="Current Password"
                secureTextEntry
                mode="outlined"
                value={currentPassword}
                onChangeText={(e) => {
                  setCurrentPassword(e);
                  setChangePasswordLoading(false);
                }}
                style={styles.input}
              />

              <TextInput
                label="New Password"
                secureTextEntry
                mode="outlined"
                value={newPassword}
                onChangeText={(e) => {
                  setNewPassword(e);
                  setChangePasswordLoading(false);
                }}
                style={styles.input}
              />

              <TextInput
                label="Confirm New Password"
                secureTextEntry
                mode="outlined"
                value={confirmPassword}
                onChangeText={(e) => {
                  setConfirmPassword(e);
                  setChangePasswordLoading(false);
                }}
                style={styles.input}
              />

              <View style={styles.buttonRow}>
                <Button onPress={() => setPasswordVisible(false)}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleChangePassword} // you’ll implement this
                  disabled={changePasswordLoading}
                >
                  Save
                </Button>
              </View>
            </Modal>
          </Portal>
        </>
      ) : (
        <></>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
  },
  loaderText: { marginTop: 10, fontSize: 16, color: "#333" },
  headerContainer: {
    alignItems: "center", // center horizontally
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // clean white theme
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconWrapper: {
    borderWidth: 4,
    borderColor: "#000",
    borderRadius: 50, // makes it circular
    padding: 12, // space around the icon
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  editButton: {
    marginTop: 20,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5e05d", // your theme yellow
    paddingVertical: 12,
    borderRadius: 10,
  },
  editText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  logoutButton: {
    marginTop: 5,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red", // your theme yellow
    paddingVertical: 12,
    borderRadius: 10,
    opacity: 0.8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  passButton: {
    marginTop: 5,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white", // your theme yellow
    paddingVertical: 12,
    borderRadius: 10,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: "#0000000",
  },
  passText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  card: { marginBottom: 20, backgroundColor: "white" },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    borderRadius: 8,
    borderColor: "#ddd",
  },
  saveButton: {
    borderRadius: 8,
  },

  scrollContent: {
    padding: 0,
  },
});
