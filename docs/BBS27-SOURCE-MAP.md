# BBS FS 2.7 — danh mục nguồn và phủ chức năng

Ngày khảo sát: 03/11/2026. Mốc cố định: `f48c4fe341df4531f78428ed22bba93d5e6073df`.
Cây Git đầy đủ: 2.215 entry, truncated=false. gradle.properties tại mốc này ghi mod_version=2.7, Minecraft 1.20.1. Chưa chứng minh binary JAR phát hành trùng mốc và chưa chạy Minecraft.

Danh mục trích từ [BBSMod.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/BBSMod.java): **14 form, 19 camera/media clip, 12 action clip** được đăng ký tích hợp. Add-on đăng ký qua event có thể bổ sung; các số này không bao gồm add-on.
“source” ở đây chứng minh có registry/lớp/trường đã đọc, không chứng minh mọi thuật toán hoặc tương tác runtime đã đúng. Các bài kiểm tra là yêu cầu tương lai, chưa PASS.

## 1. Nguồn giao diện đã đọc

| Nguồn | Nội dung xác nhận | Giới hạn |
|---|---|---|
| [UIFilmPanel.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/UIFilmPanel.java) | Dock layout, Camera/Replay/Action editors, marker, Undo, loop range, film menu và queue export | source; runtime chưa chạy |
| [UIReplaysEditor.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplaysEditor.java) | Replay/Form/Pose/IK/Physics; All tracks; section collapse; Actions mode; Body parts; bake IK/animation-to-pose entrypoints | source; runtime chưa chạy |
| [UIReplayPropertiesPanel.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/replays/UIReplayPropertiesPanel.java) | Enabled, label/nameTag, shadow, actor/pickup, first-person, relative offset, axes preview | source; runtime chưa chạy |
| [UIKeyframes.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/framework/elements/input/keyframes/UIKeyframes.java) | Copy/paste, multi-select, scale time, stack/spread/flip, track/key styles, graph selection | source; runtime chưa chạy |
| [UIKeyframeEditor.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/framework/elements/input/keyframes/UIKeyframeEditor.java) | Typed editor, track/bone/anchor target và Undo selection state | source; runtime chưa chạy |
| [UIKeyframeLoops.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/framework/elements/input/keyframes/UIKeyframeLoops.java) | Tạo/sửa/xóa/kéo loop; Ctrl snap theo số vòng; ghost keys | source; runtime chưa chạy |
| [UIKeyframeMotionShift.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/framework/elements/input/keyframes/UIKeyframeMotionShift.java) | Tay nắm dịch thời điểm chuyển động, reset, drag/cancel | source; runtime chưa chạy |
| [UIClipsPanel.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/film/UIClipsPanel.java) | Clip editor, cursor, editMultiple, embed inspector | source; runtime chưa chạy |
| [UIDashboard.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/dashboard/UIDashboard.java) | Bảy panel tích hợp; settings/selectors/utility và add-on event | source; runtime chưa chạy |
| [UIDashboardPanels.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/dashboard/panels/UIDashboardPanels.java) | Taskbar bốn phía, pin và chuyển panel | source; runtime chưa chạy |
| [Keys.java](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/java/mchorse/bbs_mod/ui/Keys.java) | KeyCombo mặc định; chưa bảo đảm không bị người dùng đổi hoặc browser chặn | source; runtime chưa chạy |

## 2. Registry và trường khai báo trực tiếp
Các field dưới đây lấy từ khai báo public Value*/KeyframeChannel trong lớp đã đọc. **Không phải danh sách đầy đủ field kế thừa**, field protected, metadata UI hoặc phạm vi keyframe được hỗ trợ. Khi triển khai phải mở cả lớp cha, UI editor, serializer và evaluator; không sinh UI chỉ từ bảng này.
Tên property là ID mã nguồn; label hiển thị lấy localization. Mỗi dòng phải có case đầu/giữa/cuối, input sai, Undo và round-trip dữ liệu. Unknown type phải giữ raw payload khi đọc tham khảo, chặn chỉnh/xuất tương thích thay vì bỏ mất.

### 2.1. Forms

| ID | Lớp nguồn | Field trực tiếp | Bài kiểm tra/chức năng cần làm |
|---|---|---|---|
| bbs:billboard | [BillboardForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/BillboardForm.java) | `texture`, `billboard`, `linear`, `mipmap`, `crop`, `resizeCrop`, `color`, `offsetX`, `offsetY`, `rotation`, `shading` | Đổi texture/crop/billboard; quay camera để kiểm tra hướng mặt. |
| bbs:video | [VideoForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/VideoForm.java) | `video`, `loop`, `videoOffset` | Đặt videoOffset và loop; kiểm tra seek đầu/cuối. |
| bbs:label | [LabelForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/LabelForm.java) | `text`, `font`, `fontSize`, `lineHeight`, `billboard`, `color`, `max`, `anchorX`, `anchorY`, `anchorLines`, `shadowX`, `shadowY`, `shadowColor`, `background`, `offset` | Sửa chữ/font/anchor/background; kiểm tra tiếng Việt và nhiều dòng. |
| bbs:model | [ModelForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/ModelForm.java) | `texture`, `materialTextures`, `model`, `pose`, `poseOverlay`, `actions`, `color`, `materials`, `shapeKeys`, `boneTracks`, `bones`, `wind`, `cemSitting`, `cemTamed`, `cemAggressive`, `cemOnShoulder`, `cemBurning`, `cemInLava`, `cemClimbing`, `cemCrawling`, `cemHealth` | Chọn model, pose, materials, shape keys, actions và bone tracks theo capability. |
| bbs:particle | [ParticleForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/ParticleForm.java) | `effect`, `paused`, `texture`, `user1`, `user2`, `user3`, `user4`, `user5`, `user6` | Chọn effect và user1–user6; kiểm tra paused và restart. |
| bbs:extruded | [ExtrudedForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/ExtrudedForm.java) | `texture`, `color`, `billboard`, `shading` | Đổi texture và shading; kiểm tra hình khối tạo từ ảnh. |
| bbs:block | [BlockForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/BlockForm.java) | `blockState`, `color` | Chọn block state và màu; giữ thuộc tính block hợp lệ. |
| bbs:item | [ItemForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/ItemForm.java) | `stack`, `modelTransform`, `color` | Chọn item stack/modelTransform; kiểm tra tư thế hiển thị. |
| bbs:anchor | [AnchorForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/AnchorForm.java) | Xem lớp và field kế thừa | Kiểm tra lớp kế thừa và quan hệ gắn; không suy ra chức năng chỉ từ tên. |
| bbs:mob | [MobForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/MobForm.java) | `mobID`, `mobNBT`, `texture`, `slim`, `pose`, `poseOverlay`, `boneTracks` | Chọn mobId/NBT/texture và pose hỗ trợ; kiểm tra input sai. |
| bbs:vanilla_particles | [VanillaParticleForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/VanillaParticleForm.java) | `settings`, `paused`, `local`, `velocity`, `count`, `frequency`, `scatteringYaw`, `scatteringPitch`, `offsetX`, `offsetY`, `offsetZ` | Đặt frequency/count/velocity/local/scattering; kiểm tra ngân sách. |
| bbs:trail | [TrailForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/TrailForm.java) | `texture`, `length`, `loop`, `paused` | Đặt length/loop/paused; tua lùi không tích lũy vệt sai. |
| bbs:framebuffer | [FramebufferForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/FramebufferForm.java) | `width`, `height`, `scale` | Đặt width/height/scale; kiểm tra vòng tham chiếu và VRAM. |
| bbs:structure | [StructureForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/StructureForm.java) | `structure`, `biome`, `color`, `origin` | Chọn structure/biome/origin; kiểm tra asset thiếu. |

### 2.2. Camera và media clips

| ID | Lớp nguồn | Field trực tiếp | Bài kiểm tra/chức năng cần làm |
|---|---|---|---|
| bbs:idle | [IdleClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/overwrite/IdleClip.java) | `position` | Camera đứng yên trong đoạn. |
| bbs:dolly | [DollyClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/overwrite/DollyClip.java) | `distance`, `yaw`, `pitch` | Camera di chuyển theo distance/yaw/pitch. |
| bbs:path | [PathClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/overwrite/PathClip.java) | `points` | Thêm/đổi thứ tự điểm đường đi và nội suy. |
| bbs:keyframe | [KeyframeClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/overwrite/KeyframeClip.java) | `x`, `y`, `z`, `yaw`, `pitch`, `roll`, `fov`, `distance`, `additive` | Chỉnh x/y/z/yaw/pitch/roll/fov/distance và additive. |
| bbs:translate | [TranslateClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/TranslateClip.java) | `translate` | Áp độ dịch lên kết quả camera trước đó. |
| bbs:angle | [AngleClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/AngleClip.java) | `angle` | Áp thay đổi góc/FOV theo selector tương ứng. |
| bbs:drag | [DragClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/DragClip.java) | `deterministic`, `factor`, `rate` | Kiểm tra deterministic/factor/rate khi tua không tuần tự. |
| bbs:shake | [ShakeClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/ShakeClip.java) | `shake`, `shakeAmount`, `noise` | Kiểm tra shake/shakeAmount/noise và tính lặp lại. |
| bbs:math | [MathClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/MathClip.java) | `expression` | Biểu thức hợp lệ chạy trong parser giới hạn; lỗi có vị trí. |
| bbs:look | [LookClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/LookClip.java) | `relative`, `atBlock`, `forward`, `block` | Nhìn mục tiêu/block/forward; xử lý target thiếu. |
| bbs:orbit | [OrbitClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/OrbitClip.java) | `copy`, `distance`, `yaw`, `pitch`, `absolute` | Quỹ đạo quanh đích; copy/absolute và khoảng cách. |
| bbs:remapper | [RemapperClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/RemapperClip.java) | `channel` | Đổi thời gian lấy mẫu bằng channel; kiểm tra biên. |
| bbs:audio | [AudioClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/misc/AudioClip.java) | `audio`, `offset`, `volume` | Đặt offset/volume; đồng bộ với playhead. |
| bbs:subtitle | [SubtitleClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/misc/SubtitleClip.java) | `placement`, `color`, `textShadow`, `background`, `backgroundOffset`, `shadow`, `shadowOpaque`, `transform`, `lineHeight`, `maxWidth`, `font`, `fontSize`, `image`, `imageRight`, `imageScale` | Đặt nội dung, font, placement, background và transform. |
| bbs:image | [ImageClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/misc/ImageClip.java) | `texture`, `placement`, `color`, `fullscreen`, `smooth`, `transform` | Đặt texture/placement/fullscreen/smooth. |
| bbs:video | [VideoClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/misc/VideoClip.java) | `placement`, `color`, `loop`, `fullscreen`, `smooth`, `transform` | Đặt video/placement/loop; kiểm tra seek, offset và đồng bộ. |
| bbs:curve | [CurveClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/misc/CurveClip.java) | `channels` | Chọn channel theo registry; xác minh tác động client. |
| bbs:tracker | [TrackerClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/TrackerClip.java) | `angle`, `fov`, `group`, `lookAt`, `relative`, `active` | Chọn target/group/component mask; kiểm tra look_at/relative. |
| bbs:dolly_zoom | [DollyZoomClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/camera/clips/modifiers/DollyZoomClip.java) | `focus` | Kiểm tra focus và quan hệ khoảng cách–FOV. |

### 2.3. Action clips

| ID | Lớp nguồn | Field trực tiếp | Bài kiểm tra/chức năng cần làm |
|---|---|---|---|
| bbs:chat | [ChatActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/chat/ChatActionClip.java) | `message` | Đặt message; browser chỉ ghi log mô phỏng. |
| bbs:command | [CommandActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/chat/CommandActionClip.java) | `command` | Đặt command; browser không thực thi lệnh game. |
| bbs:place_block | [PlaceBlockActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/blocks/PlaceBlockActionClip.java) | `state`, `drop` | Đặt state/drop và vị trí theo lớp cha; kiểm tra world fixture. |
| bbs:interact_block | [InteractBlockActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/blocks/InteractBlockActionClip.java) | `hit`, `hand` | Đặt hit/hand; phân biệt trigger một lần và range. |
| bbs:break_block | [BreakBlockActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/blocks/BreakBlockActionClip.java) | `progress` | Đặt progress; kiểm tra tiến trình phá khối. |
| bbs:use_item | [UseItemActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/item/UseItemActionClip.java) | Xem lớp và field kế thừa | Dùng item tại tick; kiểm tra tay và item từ lớp cha. |
| bbs:use_block_item | [UseBlockItemActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/item/UseBlockItemActionClip.java) | `hit` | Dùng item với hit; kiểm tra mặt block. |
| bbs:release_use_item | [ReleaseUseItemActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/item/ReleaseUseItemActionClip.java) | `charge`, `projectile`, `riptide` | Charge/projectile/riptide; kiểm tra giới hạn và kết thúc dùng. |
| bbs:drop_item | [ItemDropActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/item/ItemDropActionClip.java) | `posX`, `posY`, `posZ`, `velocityX`, `velocityY`, `velocityZ`, `relative` | Đặt vị trí/vận tốc/relative; kiểm tra vật thả. |
| bbs:attack | [AttackActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/AttackActionClip.java) | `damage` | Đặt damage/target theo lớp cha; không đồng nhất với clip chuyển động. |
| bbs:damage | [DamageActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/DamageActionClip.java) | `damage` | Áp sự kiện damage; kiểm tra đúng actor. |
| bbs:swipe | [SwipeActionClip](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/actions/types/SwipeActionClip.java) | Xem lớp và field kế thừa | Vung tay theo nguồn; không tự suy ra sát thương. |

## 3. Replay, Film và model
- [ReplayKeyframes](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/film/replays/ReplayKeyframes.java): Position, vX/vY/vZ, yaw/pitch/headYaw/bodyYaw; state channels; fall/damage/leaning/roll; stick/trigger/extra; chín hotbar ItemStack channels; selectedSlot; offhand/head/chest/legs/feet.
- [Film](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/film/Film.java): camera, replays, replayCategories, markers, hp/hunger/xp, mobRecordingRadius, description và metadata thời gian.
- [ModelForm](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/forms/forms/ModelForm.java): model/texture/materialTextures, pose/poseOverlay, actions, materials, shapeKeys, bones, wind, các thuộc tính CEM. Đây là ActionsConfig của model, khác action clips của film.
- [Keyframe](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/utils/keyframes/Keyframe.java): tick/value/duration, interpolation, handle lx/ly/rx/ry, motionShift; motionShift được giới hạn [-0.49,0.49], không hỗ trợ stepped/Constant.
- [KeyframeLoop](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/utils/keyframes/KeyframeLoop.java) và [KeyframeLoops](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/main/java/mchorse/bbs_mod/utils/keyframes/KeyframeLoops.java): loop hữu hạn, shared ID, source interval, end, move/resize và boundary semantics.
- [English labels](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/src/client/resources/assets/bbs/assets/strings/en_us.json): nguồn tên/tooltip; không dùng label một mình để khẳng định chức năng hoạt động.

## 4. Chính sách tận dụng nguồn
[LICENSE.md](https://github.com/Wemppy4/bbs-fs/blob/f48c4fe341df4531f78428ed22bba93d5e6073df/LICENSE.md) có thông báo cấp phép sử dụng/sửa/phân phối và yêu cầu giữ copyright/permission notice. Nếu port hoặc sao chép phần đáng kể, kèm thông báo McHorse 2025 và Wemppy 2026 cùng bản license. Rà license riêng của dependency, addon và tài sản; không suy ra mọi texture/model đều dùng chung license.

Java/Fabric/OpenGL UI không chạy trực tiếp trong HTML. Tái sử dụng cấu trúc, label, data contract và thuật toán đã đối chiếu bằng bản port web; dùng bộ fixture chung để test parity. Chức năng phụ thuộc world/player/server/render native dùng adapter hoặc bài hướng dẫn in-game; không làm nút giả “đã chạy”.

## 5. Phần chưa hoàn tất khảo sát
- Chưa đọc toàn bộ 2.215 entry; cây repo không phải danh sách chức năng đã kiểm chứng.
- Chưa có ảnh baseline runtime tại đúng JAR; chưa đối chiếu đầy đủ gesture/focus/tooltip.
- Field kế thừa, constraints solver, physics solver, recorder, export backend, BOBJ write path và serializer film cần khảo sát sâu trước code.
- Phải sinh manifest registry tại build để phát hiện loại mới; mỗi type thêm vào cần UI adapter, bài học và test trước khi tuyên bố phủ toàn bộ.
