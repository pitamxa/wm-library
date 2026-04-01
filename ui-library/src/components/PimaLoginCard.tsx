import { useState } from "react";
import { Globe } from "lucide-react";
import { PimaCard } from "./PimaCard";
import { PimaInput } from "./PimaInput";
import { PimaButton } from "./PimaButton";
import "../styles/login-card.css";

export function PimaLoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <div className="login-card-container">
      <PimaCard
        className="login-card"
        title="登录您的账户"
        description="输入您的邮箱以登录"
        extra={
          <a href="#" className="login-card__link" onClick={handleLinkClick}>
            注册
          </a>
        }
        size="default"
      >
        <div className="login-card__form">
          <div className="login-card__field">
            <PimaInput
              label="邮箱"
              placeholder="m@example.com"
              type="email"
              value={email}
              onValueChange={setEmail}
            />
          </div>

          <div className="login-card__field">
            <div className="login-card__label-row">
              <label className="wm-input__label">密码</label>
              <a href="#" className="login-card__link" onClick={handleLinkClick}>
                忘记密码？
              </a>
            </div>
            <PimaInput
              placeholder=""
              type="password"
              value={password}
              onValueChange={setPassword}
            />
          </div>

          <div className="login-card__actions">
            <PimaButton
              variant="primary"
              block
            >
              登录
            </PimaButton>
            
            <PimaButton
              variant="secondary"
              block
              icon={<Globe width={16} height={16} />}
            >
              使用 Google 登录
            </PimaButton>
          </div>
        </div>
      </PimaCard>
    </div>
  );
}