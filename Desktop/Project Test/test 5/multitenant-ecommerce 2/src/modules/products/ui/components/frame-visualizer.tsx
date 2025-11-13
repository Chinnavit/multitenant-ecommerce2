import Image from "next/image";

interface FrameVisualizerProps {
  imageSrc: string;      // รูปภาพสินค้า/รูปที่ลูกค้าอัปโหลด
  frameColor: string;    // สีกรอบ (เช่น black, #8B4513)
  matColor: string;      // สีกระดาษขอบ (เช่น white, #FDF5E6)
  frameWidth: number;    // ความหนากรอบ (px)
  matWidth: number;      // ความหนากระดาษขอบ (px)
}

export const FrameVisualizer = ({
  imageSrc,
  frameColor,
  matColor,
  frameWidth,
  matWidth,
}: FrameVisualizerProps) => {
  return (
    <div className="flex justify-center items-center p-4 bg-gray-100 rounded-lg">
      {/* Layer 1: ตัวกรอบรูป (Frame) */}
      <div
        className="relative shadow-2xl transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: frameColor, // สีกรอบ
          padding: `${frameWidth}px`,  // ความหนากรอบ
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // เงากรอบให้ดูมีมิติ
        }}
      >
        {/* Layer 2: กระดาษขอบ (Mat Board) */}
        <div
          className="relative transition-all duration-300 ease-in-out bg-white"
          style={{
            backgroundColor: matColor, // สีกระดาษ
            padding: `${matWidth}px`,  // ความหนากระดาษ
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)", // เงาด้านในเพื่อให้ภาพดูลึกลงไป
          }}
        >
          {/* Layer 3: รูปภาพจริง (Image) */}
          <div className="relative aspect-[4/3] w-[300px] lg:w-[500px] bg-gray-200">
            <Image
              src={imageSrc}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};