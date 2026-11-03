# Fixture và nghiệm thu bài L23–L60

Ngày: 03/11/2026. Đi cùng [SPEC v0.3](../SPEC.md). Đây là đặc tả bài, chưa phải nội dung giảng dạy/fixture code đã triển khai.
L01–L22 tham chiếu [bản nền](history/SPEC-v0.2.md) và các sửa đổi bắt buộc ở SPEC mục 1.1.

## Hợp đồng chung
Mỗi bài có fixtureId/version, sourceProfile, project ban đầu, đề tự làm, đáp án riêng, ruleSetVersion và negative variants. Số liệu dưới đây là fixture trainer đề xuất, không phải bài chính thức của mod.
- Guided demo dùng bản copy; self-test dùng bài làm thật; không auto-pass khi xem đáp án.
- Mỗi dòng phải có bản sai target, sai thời gian, sai giá trị/type hoặc missing asset thích hợp để chứng minh bộ chấm không đạt giả.
- Chấm identity/reference trước numeric; tolerances theo SPEC mục 12; kiểm immutable properties không liên quan.
- Khi nêu golden source, phải port/evaluate bằng source phiên bản cố định và lưu expected output trước khi mở bài parity. Chưa có expected output thì BLOCKED, không đoán số.
- Native bài cần receipt có input/output hashes, version và quan sát; thao tác trên trainer không thay thế receipt.
- Một bài chỉ passed khi mọi rule bắt buộc đạt; progress tách guided/independent/native-verified.

| Bài | Chủ đề | Trạng thái đầu và yêu cầu | Điều kiện đạt / lỗi phải bắt | Test family |
|---|---|---|---|---|
| L23 | Film/Replay CRUD | Cảnh 120 tick, A/B và prop gắn A; duplicate Film rồi đổi tên bản sao | ID mới, attachment remap đúng, bản gốc không đổi; delete A phải báo dependency | G03,G04 |
| L24 | Multi-key/clipboard | A.x keys 0/20/40; A.y 0/40; copy vùng 0–40, paste tại 60 vào bản sao | Tick thành 60/80/100; giá trị giữ; collision một track thì reject transaction mặc định; Undo phục hồi | G07 |
| L25 | Graph | x từ 0 tại tick0 tới 10 tại tick40; so Linear/Constant/Sine InOut rồi sửa handle kiểu hỗ trợ | Linear tick10=2.5; Constant tick10=0; Sine tick10≈1.464466; handle so golden source, không đoán | G08 |
| L26 | Keyframe loop | Loop start0/sourceEnd20/end50 trên hai numeric tracks | sourceTick 20=20,40=20,41=1,50=10; move+10 dịch source/block; remove giữ source keys | G09 |
| L27 | Motion shift | Numeric Linear từ 0→10 trong 40 tick; shift0 rồi ±0.25, reset; thử Constant | Endpoints giữ; giá trị giữa theo remapMotion source; Constant không cho shift; Escape trả giá trị cũ | G10 |
| L28 | Marker/layout | Markers 20/60/100; dock inspector sang phải, hide/reopen, layout Undo; step từ20 | Next marker60; step21; project revision không đổi do layout; reset không xóa markers | G02,G11 |
| L29 | Camera nền | Idle 0–40, Dolly 40–80, duration120; đặt pose camera và base values có source fixture | Observer không ghi film key; sample0/20/40/60/80 so evaluator nguồn; unsupported boundary chặn parity | G16 |
| L30 | Path/Keyframe | Path ba điểm tại trạng thái đầu/giữa/cuối nguồn; đổi sang Keyframe bằng converter được hỗ trợ | Các điểm và quỹ đạo theo converter source trong tolerance; converter không có phải disable | G16 |
| L31 | Camera modifiers | Camera base + Translate X=2; bật/tắt Angle/Shake/Drag trong fixture riêng | Translate chỉ thay component hỗ trợ; mỗi modifier golden test; không đổi thứ tự layer âm thầm | G16 |
| L32 | Target/Tracker | A đứng, B di chuyển; camera Look/Orbit/Tracker target B; thử xóa B | Target mapping đúng; delete có dependency; group/bone thiếu báo lỗi, không NaN | G04,G16 |
| L33 | Remapper/Math/Curve | Remap fixture có freeze; Math biểu thức hợp lệ/sai; Curve channel có adapter | Time mapping đúng golden; parse lỗi có vị trí; channel thiếu adapter không được coi đã áp | G16 |
| L34 | Audio timing | Audio fixture có click tại 1 giây; clip start20 tick, offset0, volume1 | Click vào tick40 trong playback sai lệch ≤1 tick; pause/seek không phát chồng; file gốc không đổi | G17 |
| L35 | Overlay | Subtitle Việt, PNG alpha và video test có timecode; range20–60 | Font/alpha/placement đúng; seek tick40 đúng media timestamp; video chưa decode hiện loading | G17 |
| L36 | Shot camera | 120 tick: hai Replay, camera base + modifier, marker40/80, audio và phụ đề | Timeline đồng bộ; từng channel/clip khớp fixture; không chấm chỉ từ ảnh đẹp | G16,G17,G30 |
| L37 | Action events | Đặt chat/swipe/attack/damage vào event lane tại20/40/60/80; command chỉ dry-run | Đúng event type/target/tick; attack không bị đổi thành wave clip; web chỉ log command | G18 |
| L38 | Block/item events | World fixture gồm block đích và item; lần lượt place/interact/break/use/use-on-block/release/drop | Mỗi event có payload đúng schema lớp cha; scrub về0 rồi80 tái tạo cùng fixture; không tác động game thật | G18 |
| L39 | Recording | Record take40 tick chỉ position; overdub20–30; discard rồi accept take mới | Rotation/hotbar không đổi; discard giữ take cũ; disconnect giữ bản nháp và diagnostic | G19 |
| L40 | IK | Rig hai đoạn dài1+1; target reachable(1,1,0), unreachable(3,0,0), singular ởgốc | Reachable trong tolerance source; unreachable không NaN; kiểm pole flip và Undo target | G20 |
| L41 | Constraints/physics | Rig chain có giới hạn; physics wind fixture seed cố định, timeline120 | Constraints không vượt giới hạn hợp lệ; sample100→20→100 tái tạo cùng state hoặc ghi unsupported parity | G20,G21 |
| L42 | Bake | Bake IK/physics range0–40 step2 trên bones được chọn; preview rồi commit/Undo | 21 sample mốc; midpoint kiểm sai số; bones không chọn giữ; Undo khôi phục procedural config | G21 |
| L43 | Morphing | Catalog14 built-ins, tìm kiếm, favorite, clone preset, nested part | Type đủ, path riêng; sửa clone không đổi preset gốc; unsupported fields giải thích | G01,G14 |
| L44 | Model blocks | Đặt block mẫu trong world fixture, parent transform và local offset | Local/world đúng golden; native route chưa receipt không báo placed in game | G15,G22 |
| L45 | Particles | Scheme mẫu deterministic, frequency/count đổi, pause và tua lùi | Không nhân hạt khi seek; vượt budget báo; unsupported component không mất raw data | G14,G22 |
| L46 | Model hierarchy | Model có root/child, chỉnh pivot/transform, đổi tên bone đang được track dùng | Reference ID giữ; pivot/world đúng golden; Undo hoàn tác; cycle bị chặn | G15,G22 |
| L47 | Geometry/UV | Asset cube fixture, chỉnh UV một mặt bằng công cụ source hỗ trợ, save-as | Mặt khác giữ UV; texture mapping đúng; loại mesh chưa hỗ trợ route adapter | G22 |
| L48 | Texture layers/frames | Ảnh16×16 hai layer, alpha, hai frame; resize32×32 rồi Undo | Layer order/alpha/frame duration giữ; Undo trả16×16; source asset không bị sửa do save-as | G22 |
| L49 | Audio workspace | WAV fixture2 giây, trim0.5–1.5 giây, xuất bản sao | Kết quả1 giây theo sample rate; original giữ; codec thiếu báo rõ | G17,G22 |
| L50 | Asset repair/settings | Project thiếu một texture; relink hash đúng; đổi keybind/quality/reset layout | Reference phục hồi đúng; không reset bài/asset khi reset layout; keybind trùng có cảnh báo | G22,G28 |
| L51 | Trainer JSON | Export/import project; migration1→4; thử future schema và file corrupt | Giữ key/ID/asset refs; lỗi không thay project; progress version đổi cần kiểm tra lại | G23,G24 |
| L52 | Native Film | Golden Film có2 Replay+camera+action; dry-run rồi export theo target profile | Loss report đầy đủ; import thật có receipt; chưa runtime chỉ NOT_RUN, không PASS | G25 |
| L53 | BOBJ model | Model nhỏ có mesh/UV/material/armature; import và preview rest pose | Counts/hierarchy/transform đúng fixture; truncated/count quá lớn từ chối trước allocation lớn | G23,G26 |
| L54 | Animation-only | Gán action mẫu cho rig đúng rồi rig khác signature | Rig đúng chuyển động tại0/20/40; rig sai reject hoặc mapping explicit, không áp nhầm | G26 |
| L55 | FBX/Blender mapping | Fixture có unit scale khác và root motion; adapter export/import có manifest | Unit/axes/bone mapping/root motion đúng; không kết luận tương thích mọi Mixamo rig | G26 |
| L56 | Round-trip hai nhân vật | Cảnh120 tick, A root motion, B pose/action, camera và visibility | Mở lại native: các điểm0/40/60/120 đúng tolerance; có log version và asset hashes | G32 |
| L57 | Tìm lỗi | Cảnh có sai Replay, key nháp chưa lưu, missing asset, loop sai biên, event target sai | Chỉ đạt khi sửa đúng từng lỗi; gợi ý không tự sửa; lưu lịch sử attempted/assisted | G30 |
| L58 | Quality | Cùng cảnh với Low/Medium/High, physics/VFX xác định | Data/evaluator/result hash giữ nguyên; so render perf riêng; không tính giảm effect thành đúng parity | G28,G29 |
| L59 | Export queue | Hai job snapshot, jobA120 tick30fps, sửa project sau enqueue; cancel jobB | A180 frame; snapshot không đổi; B cancelled không completed; audio drift test | G27 |
| L60 | Bài cuối | Dựng shot240 tick hai nhân vật, camera, event, audio; backup/export/open lại | Mọi nhóm bắt buộc đúng; native receipt và loss report; không lấy tổng điểm bù nhóm mất dữ liệu | G25,G26,G27,G32 |

## Bộ kiểm tra bao phủ registry
Các bài nhóm L31/L37/L38/L43/L45 không chỉ dùng một ví dụ đại diện. Fixture suite phải có subcase cho từng type trong SOURCE-MAP: 14 form, 19 camera/media clip và 12 action events. Có thể chia subcase thành bài con UI nhưng không được bỏ type khó và vẫn báo 100%.
Mỗi subcase ghi trạng thái UI/schema/evaluator/runtime riêng. Ví dụ ModelForm.actions và AttackActionClip nằm hai bộ case khác nhau.

## Mẫu rule machine-readable dự kiến
Fields: ruleId, targetPath, ruleType, interval/ticks, expected/expectedFixtureRef, tolerance, immutablePaths, errorMessageVi, sourceEvidenceIds.
Rule types: identity, capability, discreteIntervals, numericCurveBound, sourceGolden, eventSequence, assetHash, graphInvariant, nativeReceipt.
Rule sourceGolden/nativeReceipt không có fixture/evidence thì trả blocked, không trả passed=false kiểu người học làm sai.
Thông báo phải phân biệt lỗi bài làm và lỗi khả năng của phòng tập.
