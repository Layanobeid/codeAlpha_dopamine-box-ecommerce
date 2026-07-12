// components/footer.js
export default function Footer() {
    const footer = document.getElementById('footer');
    
    footer.innerHTML = `
        <footer class="footer" style="background:#111;color:white;padding:40px 0 20px;margin-top:60px;">
            <div class="container">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px;padding:0 20px;">
                    <div>
                        <h3 style="color:#ff6b6b;">🎁 Dopamine Box</h3>
                        <p style="color:#aaa;">Happiness in every gift.</p>
                    </div>
                    <div>
                        <h4 style="color:#fff;">Quick Links</h4>
                        <ul style="list-style:none;padding:0;">
                            <li><a href="index.html" style="color:#aaa;text-decoration:none;display:block;margin:6px 0;">Home</a></li>
                            <li><a href="products.html" style="color:#aaa;text-decoration:none;display:block;margin:6px 0;">Products</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style="color:#fff;">Support</h4>
                        <ul style="list-style:none;padding:0;">
                            <li><a href="contact.html" style="color:#aaa;text-decoration:none;display:block;margin:6px 0;">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div style="text-align:center;padding:20px 0;border-top:1px solid #333;color:#777;margin-top:20px;">
                    <p>&copy; ${new Date().getFullYear()} Dopamine Box. Made with ❤️ in Lebanon</p>
                </div>
            </div>
        </footer>
    `;
}