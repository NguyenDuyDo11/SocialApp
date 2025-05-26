import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const DUMMY_POSTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', title: 'Bãi biển', content: 'Check-in biển xanh' },
  { id: '2', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', title: 'Núi', content: 'Leo núi cuối tuần' },
  { id: '3', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', title: 'Cafe', content: 'Cà phê sáng chill' },
  { id: '4', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', title: 'Đêm', content: 'Thành phố về đêm' },
  { id: '5', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', title: 'Bạn bè', content: 'Đi chơi cùng bạn' },
  { id: '6', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', title: 'Thể thao', content: 'Chạy bộ buổi sáng' },
];

const ProfileScreen = () => {
  // Dummy user data
  const [user, setUser] = useState({
    name: 'Eytyxia Nguyễn',
    username: '@EytyxiaNguyeen',
    bio: 'Lover of code, coffee, and dogs.',
    avatar: 'https://i.pravatar.cc/150?img=3',
    followers: 120,
    following: 180,
    posts: DUMMY_POSTS.length,
    email: 'john.doe@email.com',
  });

  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editEmail, setEditEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!editName.trim() || !editEmail.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setUser((prev) => ({
        ...prev,
        name: editName,
        bio: editBio,
        email: editEmail,
      }));
      setEditModalVisible(false);
      setSaving(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header Instagram Style */}
      <View style={styles.intaHeader}>
        <View style={styles.avatarBorder}>
          <Image source={{ uri: user.avatar }} style={styles.intaAvatar} />
        </View>
        <View style={styles.intaStatsWrap}>
          <View style={styles.intaStatItem}>
            <Text style={styles.intaStatNumber}>{posts.length}</Text>
            <Text style={styles.intaStatLabel}>Bài viết</Text>
          </View>
          <View style={styles.intaStatItem}>
            <Text style={styles.intaStatNumber}>{user.followers}</Text>
            <Text style={styles.intaStatLabel}>Người theo dõi</Text>
          </View>
          <View style={styles.intaStatItem}>
            <Text style={styles.intaStatNumber}>{user.following}</Text>
            <Text style={styles.intaStatLabel}>Đang theo dõi</Text>
          </View>
        </View>
      </View>
      <View style={styles.intaNameWrap}>
        <Text style={styles.intaName}>{user.name}</Text>
        <Text style={styles.intaEmail}>{user.email}</Text>
        <Text style={styles.intaBio}>{user.bio}</Text>
      </View>
      <TouchableOpacity onPress={() => {
        setEditName(user.name);
        setEditBio(user.bio);
        setEditEmail(user.email);
        setEditModalVisible(true);
      }} style={styles.intaEditBtn}>
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
        style={{ flexGrow: 0 }}
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
            <TextInput
              style={styles.input}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Bio"
              multiline
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  intaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 18,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 18,
  },
  avatarBorder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2.5,
    borderColor: '#e1306c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginRight: 18,
  },
  intaAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#e0e7ef',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  intaStatsWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 0,
  },
  intaStatItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  intaStatNumber: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#22223b',
    marginBottom: 1,
  },
  intaStatLabel: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 1,
  },
  intaNameWrap: {
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 2,
  },
  intaName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#22223b',
    marginBottom: 1,
  },
  intaEmail: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 1,
  },
  intaBio: {
    color: '#22223b',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 8,
    maxWidth: '92%',
  },
  intaEditBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  intaEditBtnText: {
    color: '#22223b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    alignItems: 'stretch',
    shadowColor: '#22223b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22223b',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#f2f6fc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#334155',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: '#e1306c',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 15,
  },
  intaPostCard: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
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
    fontSize: 16,
  },
});

export default ProfileScreen;