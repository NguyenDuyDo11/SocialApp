import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, Modal, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserInfo(userSnap.data());
          setEditName(userSnap.data().name);
          setEditEmail(userSnap.data().email);
        }
        // Fetch user's posts
        let userPosts = [];
        try {
          const postsRef = collection(db, 'posts');
          const q = query(postsRef, where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            userPosts.push({ id: doc.id, ...doc.data() });
          });
        } catch (e) {
          // ignore
        }
        // Nếu không có bài đăng thực, tạo danh sách bài đăng mẫu dạng Instagram
        if (userPosts.length === 0) {
          userPosts = [
            { id: '1', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', title: 'Bãi biển', content: 'Check-in biển xanh' },
            { id: '2', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', title: 'Núi', content: 'Leo núi cuối tuần' },
            { id: '3', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', title: 'Cafe', content: 'Cà phê sáng chill' },
            { id: '4', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', title: 'Đêm', content: 'Thành phố về đêm' },
            { id: '5', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80', title: 'Bạn bè', content: 'Đi chơi cùng bạn' },
            { id: '6', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', title: 'Thể thao', content: 'Chạy bộ buổi sáng' },
          ];
        }
        setPosts(userPosts);
      } catch (e) {
        Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân.');
      }
      setLoading(false);
    };
    fetchUserInfo();
  }, [user]);

  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Lỗi', 'Tên và email không được để trống.');
      return;
    }
    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name: editName, email: editEmail });
      setUserInfo((prev) => ({ ...prev, name: editName, email: editEmail }));
      setEditModalVisible(false);
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header Instagram Style */}
      <View style={styles.intaHeader}>
        <View style={styles.avatarBorder}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.intaAvatar}
          />
        </View>
        <View style={styles.intaStatsWrap}>
          <View style={styles.intaStatItem}>
            <Text style={styles.intaStatNumber}>{posts.length}</Text>
            <Text style={styles.intaStatLabel}>Bài viết</Text>
          </View>
          <View style={styles.intaStatItem}>
            <Text style={styles.intaStatNumber}>120</Text>
            <Text style={styles.intaStatLabel}>Người theo dõi</Text>
          </View>
          <View style={styles.intaStatItem}>
            <Text style={styles.intaStatNumber}>180</Text>
            <Text style={styles.intaStatLabel}>Đang theo dõi</Text>
          </View>
        </View>
      </View>
      <View style={styles.intaNameWrap}>
        <Text style={styles.intaName}>{userInfo?.name || 'No Name'}</Text>
        <Text style={styles.intaEmail}>{userInfo?.email || 'No Email'}</Text>
      </View>
      <TouchableOpacity onPress={() => setEditModalVisible(true)} style={styles.intaEditBtn}>
        <MaterialIcons name="edit" size={20} color="#3b82f6" style={{marginRight: 6}} />
        <Text style={styles.intaEditBtnText}>Chỉnh sửa thông tin</Text>
      </TouchableOpacity>
      {/* User's Posts Grid */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.intaPostCard}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.intaPostImage} />
            ) : (
              <View style={styles.intaPostPlaceholder}>
                <Text style={styles.intaPostTitle}>{item.title?.slice(0, 2) || 'No'}</Text>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Tên"
            />
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Lưu</Text>}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  intaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 18,
    paddingHorizontal: 24,
  },
  avatarBorder: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 3,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 18,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  intaAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e0e7ef',
  },
  intaStatsWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  intaStatItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  intaStatNumber: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#22223b',
  },
  intaStatLabel: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  intaNameWrap: {
    marginBottom: 8,
    marginLeft: 24,
  },
  intaName: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#22223b',
    marginBottom: 2,
  },
  intaEmail: {
    color: '#64748b',
    fontSize: 15,
  },
  intaEditBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  intaEditBtnText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  noPosts: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 6,
  },
  postContent: {
    fontSize: 15,
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f6fc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#334155',
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#e0e7ef',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intaPostCard: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e0e7ef',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  intaPostImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  intaPostPlaceholder: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cbd5e1',
  },
  intaPostTitle: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
