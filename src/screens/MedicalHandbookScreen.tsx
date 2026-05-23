import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

interface HandbookItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  whenToUse: string;
  steps: string[];
  cautions: string[];
  forbidden: string[];
}

const HANDBOOK_DATA: HandbookItem[] = [
  {
    id: 'cpr',
    icon: '🫀',
    title: 'Hồi Sức Tim Phổi (CPR)',
    subtitle: 'Áp dụng cho người bị ngưng tim, ngưng thở đột ngột',
    whenToUse: 'Nạn nhân bất tỉnh, không thở hoặc thở ngáp cá, không có mạch đập.',
    steps: [
      'Gọi cấp cứu (115) ngay lập tức hoặc nhờ người xung quanh gọi.',
      'Đặt nạn nhân nằm ngửa trên nền cứng, bằng phẳng.',
      'Ép tim ngoài lồng ngực: Đặt 2 tay chồng lên nhau ở giữa ngực nạn nhân (1/3 dưới xương ức). Ấn sâu 5-6 cm với tốc độ 100-120 lần/phút. Ép liên tục 30 lần.',
      'Khai thông đường thở: Nghiêng đầu nạn nhân ra sau, nâng cằm lên.',
      'Hà hơi thổi ngạt: Bịt mũi nạn nhân, áp miệng ngậm kín miệng nạn nhân và thổi vào 2 hơi mạnh (mỗi hơi 1 giây), quan sát lồng ngực phập phồng.',
      'Lặp lại chu kỳ: 30 lần ép tim - 2 lần thổi ngạt liên tục cho đến khi nhân viên y tế đến hoặc nạn nhân cử động được.'
    ],
    cautions: [
      'Đảm bảo vị trí ép tim chính xác để tránh gãy xương sườn.',
      'Cho phép lồng ngực nở rộng hoàn toàn sau mỗi lần ép tim.'
    ],
    forbidden: [
      'Không thực hiện ép tim nếu nạn nhân vẫn còn tỉnh táo, thở bình thường hoặc cử động.'
    ]
  },
  {
    id: 'heimlich',
    icon: ' choking', // We can use emoji directly
    title: 'Hóc Dị Vật Đường Thở (Heimlich)',
    subtitle: 'Cứu nghẹn đường thở khẩn cấp',
    whenToUse: 'Nạn nhân trợn mắt, hai tay ôm cổ, không thể nói, không thể thở hoặc mặt tím tái.',
    steps: [
      'Đứng sau lưng nạn nhân, vòng hai tay ôm lấy eo của họ.',
      'Nắm một bàn tay lại thành nắm đấm, đặt ngón cái của nắm đấm ngay trên rốn và dưới xương ức nạn nhân.',
      'Dùng tay kia ôm lấy nắm đấm, thực hiện động tác giật mạnh từ dưới lên trên và hướng vào trong (hình chữ J).',
      'Thực hiện liên tục 5 lần giật bụng. Kiểm tra xem dị vật đã văng ra chưa.',
      'Nếu nạn nhân bất tỉnh: Đặt nằm ngửa, gọi 115 và tiến hành CPR ngay lập tức, kiểm tra xem có thấy dị vật trong miệng để lấy ra không.'
    ],
    cautions: [
      'Đối với phụ nữ mang thai hoặc người béo phì: Thực hiện ép ngực (đặt nắm đấm giữa xương ức) thay vì ép bụng.',
      'Đối với trẻ sơ sinh (<1 tuổi): Vỗ lưng 5 lần (đặt bé nằm sấp trên cánh tay dốc đầu xuống) phối hợp ấn ngực 5 lần (đặt bé nằm ngửa).'
    ],
    forbidden: [
      'Không dùng ngón tay móc mù quáng trong họng vì có thể đẩy dị vật vào sâu hơn.'
    ]
  },
  {
    id: 'bleeding',
    icon: '🩸',
    title: 'Cầm Máu Vết Thương Hở',
    subtitle: 'Ngăn ngừa sốc giảm thể tích do mất máu cấp',
    whenToUse: 'Vết thương sâu chảy máu xối xả hoặc phun thành tia.',
    steps: [
      'Đeo găng tay bảo hộ (nếu có) hoặc dùng túi nilon để tránh lây nhiễm chéo.',
      'Ấn trực tiếp: Dùng gạc sạch hoặc vải sạch ép mạnh trực tiếp lên vết thương đang chảy máu trong 5-10 phút.',
      'Nâng cao chi: Nếu vết thương ở tay hoặc chân, hãy nâng cao chi bị thương hơn mức tim (nếu không nghi ngờ gãy xương).',
      'Băng ép: Dùng băng cuộn băng chặt vết thương đè lên gạc (không băng quá chặt làm tím tái đầu chi).',
      'Nếu máu vẫn thấm qua băng: Đặt thêm gạc và băng đè lên lớp băng cũ, KHÔNG tháo bỏ lớp băng cũ ra.'
    ],
    cautions: [
      'Giữ nạn nhân nằm yên ấm áp để ngăn ngừa tình trạng sốc.',
      'Đặt garo chỉ là giải pháp cuối cùng khi đứt lìa chi hoặc băng ép không hiệu quả.'
    ],
    forbidden: [
      'Không rửa hoặc cố gắng cạy sạch vết thương sâu đang chảy máu nhiều.',
      'Không rút các dị vật lớn găm sâu vào vết thương (hãy băng cố định xung quanh dị vật).'
    ]
  },
  {
    id: 'burn',
    icon: '🔥',
    title: 'Sơ Cứu Bỏng Nhiệt',
    subtitle: 'Giảm đau và ngăn ngừa tổn thương da sâu',
    whenToUse: 'Bỏng do nước sôi, lửa, hơi nước nóng hoặc chạm vào vật nóng.',
    steps: [
      'Cách ly nạn nhân khỏi nguồn gây bỏng ngay lập tức.',
      'Làm mát: Dội nước sạch, mát (không dùng nước đá) lên vùng bỏng trong ít nhất 15 - 20 phút để hạ nhiệt.',
      'Tháo bỏ đồ trang sức, đồng hồ hoặc quần áo ở vùng bỏng trước khi vết bỏng sưng nề.',
      'Bảo vệ vết bỏng: Che phủ lỏng vùng bỏng bằng băng gạc vô trùng hoặc vải sạch không xơ.',
      'Cho nạn nhân uống nhiều nước ấm để bù nước.'
    ],
    cautions: [
      'Chỉ tự xử lý tại nhà vết bỏng nhẹ, diện tích nhỏ (độ 1, độ 2 diện tích nhỏ hơn lòng bàn tay). Vết bỏng lớn cần đi bệnh viện ngay.'
    ],
    forbidden: [
      'Tuyệt đối KHÔNG chọc vỡ các bóng nước.',
      'KHÔNG bôi kem đánh răng, mỡ trăn, nước mắm hoặc đá lạnh trực tiếp lên vết bỏng vì dễ gây nhiễm trùng và hoại tử da.'
    ]
  },
  {
    id: 'fracture',
    icon: '🦴',
    title: 'Cố Định Gãy Xương',
    subtitle: 'Hạn chế di lệch đầu xương và giảm đau đớn',
    whenToUse: 'Nghi ngờ gãy xương khi chi bị biến dạng, sưng tấy, cực kỳ đau đớn hoặc không thể cử động được.',
    steps: [
      'Giữ nạn nhân nằm yên, trấn an tinh thần.',
      'KHÔNG cố nắn chỉnh đầu xương bị lệch về vị trí cũ.',
      'Tìm nẹp thích hợp: Dùng nẹp gỗ, bìa carton cứng, hoặc buộc chi gãy vào chi lành bên cạnh.',
      'Đặt nẹp nâng đỡ: Đặt nẹp ôm sát chi gãy, lót vải mềm ở các đầu xương lồi tránh cọ xát.',
      'Cố định nẹp: Dùng dây hoặc băng cuộn buộc cố định nẹp ở trên và dưới khớp của vùng xương gãy.',
      'Chườm lạnh giảm sưng xung quanh vùng chấn thương (tránh đặt đá trực tiếp lên da).'
    ],
    cautions: [
      'Kiểm tra mạch và cảm giác đầu chi sau khi buộc nẹp để đảm bảo không buộc quá chặt gây tắc mạch máu.'
    ],
    forbidden: [
      'Không cố gắng di chuyển nạn nhân nghi ngờ gãy xương đùi hoặc cột sống nếu không có cáng chuyên dụng.'
    ]
  }
];

export default function MedicalHandbookScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Banner giới thiệu */}
        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>🏥</Text>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.introTitle}>Hướng Dẫn Sơ Cứu Sống Còn</Text>
            <Text style={styles.introDesc}>
              Cẩm nang thao tác nhanh tại chỗ giúp bạn chủ động xử lý tai nạn, bảo vệ bản thân và cứu sống người thân trong thời gian chờ y tế.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Danh mục sơ cứu khẩn cấp</Text>

        {HANDBOOK_DATA.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <View key={item.id} style={[styles.card, isExpanded && styles.cardExpanded]}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.headerLeft}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.icon}>{item.icon}</Text>
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                </View>
                <Text style={styles.arrowIcon}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.cardContent}>
                  {/* Trường hợp áp dụng */}
                  <View style={styles.infoBox}>
                    <Text style={styles.infoBoxTitle}>🔔 Khi Nào Cần Áp Dụng:</Text>
                    <Text style={styles.infoBoxText}>{item.whenToUse}</Text>
                  </View>

                  {/* Các bước sơ cứu */}
                  <Text style={styles.contentSectionTitle}>🛠️ Các Bước Thực Hiện:</Text>
                  {item.steps.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}

                  {/* Cảnh báo quan trọng */}
                  {item.cautions.length > 0 && (
                    <View style={styles.cautionBox}>
                      <Text style={styles.cautionBoxTitle}>⚠️ Lưu Ý Quan Trọng:</Text>
                      {item.cautions.map((caution, idx) => (
                        <Text key={idx} style={styles.cautionText}>• {caution}</Text>
                      ))}
                    </View>
                  )}

                  {/* Điều cấm kỵ */}
                  {item.forbidden.length > 0 && (
                    <View style={styles.forbiddenBox}>
                      <Text style={styles.forbiddenBoxTitle}>❌ Tuyệt Đối KHÔNG Làm:</Text>
                      {item.forbidden.map((forb, idx) => (
                        <Text key={idx} style={styles.forbiddenText}>• {forb}</Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.disclaimerText}>
          * Lưu ý: Các hướng dẫn sơ cứu trên đây mang tính chất tham khảo khẩn cấp tại chỗ. Trong mọi trường hợp nguy hiểm, hãy ưu tiên gọi Tổng đài Cấp cứu 115 sớm nhất có thể.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  introEmoji: {
    fontSize: 36,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065f46',
  },
  introDesc: {
    fontSize: 12,
    color: '#047857',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  cardExpanded: {
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 11,
    color: '#94a3b8',
    marginLeft: 8,
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    marginBottom: 14,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoBoxText: {
    fontSize: 13,
    color: '#1e3a8a',
    lineHeight: 18,
  },
  contentSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  cautionBox: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  cautionBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  cautionText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },
  forbiddenBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  forbiddenBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 4,
  },
  forbiddenText: {
    fontSize: 12,
    color: '#7f1d1d',
    lineHeight: 18,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
