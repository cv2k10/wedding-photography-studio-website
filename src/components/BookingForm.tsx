import type { ReactNode } from "react";

export type PackageOption = {
  id: number;
  name: string;
  price: number;
  category: "photo" | "wedding";
};

type BookingFormProps = {
  packages: PackageOption[];
  defaultPackageId: number | null;
  bookingId?: number;
  errorText?: string;
};


const inputClass =
  "w-full rounded-xl border border-gold/25 bg-ivory/60 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10";

export function BookingForm({ packages, defaultPackageId, bookingId, errorText }: BookingFormProps) {
  const photoPackages = packages.filter((item) => item.category === "photo");
  const weddingPackages = packages.filter((item) => item.category === "wedding");

  if (bookingId) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-[0_24px_60px_-30px_rgba(45,39,37,0.35)] ring-1 ring-gold/20 md:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush text-2xl text-gold">
          ✓
        </div>
        <h2 className="mt-6 font-serif text-3xl text-ink">预约提交成功</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
          感谢您的信任！婚拍顾问会在 24 小时内与您联系，确认档期与拍摄方案。
        </p>
        {bookingId ? (
          <p className="mt-4 text-sm text-ink">
            预约编号：<span className="font-semibold text-gold">#{bookingId}</span>
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/portfolio"
            className="rounded-full border border-gold px-7 py-3 text-sm tracking-widest text-gold transition hover:bg-gold hover:text-white"
          >
            继续浏览作品
          </a>
          <a
            href="/booking"
            className="rounded-full bg-gold px-7 py-3 text-sm tracking-widest text-white transition hover:bg-gold-dark"
          >
            再次预约
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      method="post" action="/booking"
      className="rounded-3xl bg-white p-8 shadow-[0_24px_60px_-30px_rgba(45,39,37,0.35)] ring-1 ring-gold/20 md:p-10"
    >
      <h2 className="font-serif text-2xl text-ink md:text-3xl">填写预约信息</h2>
      <p className="mt-2 text-sm text-muted">带 * 为必填项，提交后顾问将尽快与您联系。</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field label="新人姓名" required>
          <input
            name="coupleName"
            required
            maxLength={40}
            placeholder="例如：张三 & 李四"
            className={inputClass}
          />
        </Field>
        <Field label="联系电话" required>
          <input
            name="phone"
            required
            inputMode="tel"
            maxLength={20}
            placeholder="手机号码"
            className={inputClass}
          />
        </Field>
        <Field label="预计婚期" required>
          <input name="weddingDate" type="date" required className={inputClass} />
        </Field>
        <Field label="微信号">
          <input name="wechat" maxLength={40} placeholder="方便顾问添加微信" className={inputClass} />
        </Field>
        <Field label="意向套系">
          <select
            name="packageId"
            defaultValue={defaultPackageId ? String(defaultPackageId) : ""}
            className={inputClass}
          >
            <option value="">暂未确定，希望顾问推荐</option>
            {photoPackages.length > 0 ? (
              <optgroup label="婚纱摄影">
                {photoPackages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · ¥{item.price}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {weddingPackages.length > 0 ? (
              <optgroup label="婚礼跟拍">
                {weddingPackages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · ¥{item.price}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </select>
        </Field>
        <Field label="拍摄城市 / 意向场景">
          <input
            name="city"
            maxLength={60}
            placeholder="例如：上海 · 海边 / 中式古建"
            className={inputClass}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="留言">
            <textarea
              name="message"
              rows={4}
              maxLength={1000}
              placeholder="告诉我们你们的故事、喜欢的风格或特别的需求"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {errorText ? (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{errorText}</p>
      ) : null}

      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-gold py-3.5 text-sm tracking-[0.3em] text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        提交预约
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink/80">
        {label}
        {required ? <span className="ml-1 text-gold">*</span> : null}
      </span>
      {children}
    </label>
  );
}
